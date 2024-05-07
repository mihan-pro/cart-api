import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Cart } from '../models';
import { DBClient } from '../../db/db.client';
import { SQL_COMMANDS } from '../../db/constants';

@Injectable()
export class CartService {
  async findByUserId(userId: string): Promise<Cart> {
    try {
      const userCart = await DBClient.query(SQL_COMMANDS.SELECT_CART, [userId]);
      const items = await DBClient.query(SQL_COMMANDS.SELECT_CART_ITEMS, [
        userCart?.rows?.[0]?.id,
      ]);
      return {
        id: userCart?.rows?.[0]?.id,
        items: items?.rows,
      };
    } catch (error) {
      await DBClient.end();
      throw error;
    }
  }

  async createByUserId(userId: string) {
    const id = v4();
    const userCart = {
      id,
      items: [],
    };
    try {
      await DBClient.query(SQL_COMMANDS.INSERT_CART, [id, userId, 'OPEN']);
    } catch (error) {
      await DBClient.end();
      throw error;
    }
    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart.id) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    items: { id: string; count: number }[],
  ): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    Promise.all(
      items.map(({ id: product_id, count }) => {
        return DBClient.query(SQL_COMMANDS.INSERT_CART_ITEMS, [
          id,
          product_id,
          count,
        ]);
      }),
    ).catch((error) => {
      console.log(error);
      DBClient.end();
      throw error;
    });

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    };

    return { ...updatedCart };
  }

  async removeByUserId(userId): Promise<void> {
    const cart = await this.findByUserId(userId);
    if (cart.id) {
      await DBClient.query(SQL_COMMANDS.DELETE_CART_ITEMS, [cart.id]);
      await DBClient.query(SQL_COMMANDS.DELETE_CART, [cart.id]);
    }
  }

  async checkout(
    cart: Cart,
    userId: string,
    body: {
      payment: { type: string };
      delivery: { address: string; city: string };
      comments: string;
    },
  ): Promise<void> {
    await DBClient.query(SQL_COMMANDS.INSERT_ORDER, [
      v4(),
      userId,
      cart.id,
      JSON.stringify(body.payment),
      JSON.stringify(body.delivery),
      body.comments,
      'NEW',
      0,
    ]);
    await DBClient.query(SQL_COMMANDS.UPDATE_CART, ['ORDERED', cart.id]);
  }
}
