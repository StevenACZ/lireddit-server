// MikroORM
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';

// Express
import { Request, Response } from 'express';

export type MyContext = {
	em: EntityManager<IDatabaseDriver<Connection>>;
	req: Request & any;
	res: Response;
};
