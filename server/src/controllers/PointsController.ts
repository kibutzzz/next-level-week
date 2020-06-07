import connection from "../database/connection";
import { Request, Response } from 'express';
import Knex from "knex";

class PointsControllers {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map(item => Number(item.trim()));

    const points = await connection("points")
      .join("points_items", "points.id", "=", "points_items.point_id")
      .whereIn("points_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => ({
      ...point,
      image_url: `http://192.168.2.106:3333/uploads${point.image}`
    }))

    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await connection("points").where("id", id).first();

    if (!point) {
      return response.status(404).json({ message: "Point not found." });
    }

    const items = await connection("items")
      .join("points_items", "items.id", "=", "points_items.item_id")
      .where("points_items.point_id", id);
    console.log(point)

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.2.106:3333/uploads/${point.image}`
    };

    return response.json({ point: serializedPoint, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await connection.transaction();

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      image: request.file.filename
    }

    console.log(point.image)
    const insertedIds = await trx("points").insert(point);
    const point_id = insertedIds[0];
    const pointItems = items
      ?.split(",")
      ?.map((item: string) => Number(item.trim()))
      ?.map((item_id: Number) => {
        return {
          item_id,
          point_id,
        }
      })

    if (pointItems) {
      await trx("points_items").insert(pointItems);
    }

    await trx.commit();

    return response.json({
      id: point_id,
      ...point,
    });
  }

}

export default PointsControllers;