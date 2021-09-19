// Path
import path from 'path';

// MikroORM
import { MikroORM } from '@mikro-orm/core';

// Constants
import { __prod__ } from './constants';

// Entities
import { Post } from './entities/Post';
import { User } from './entities/User';

export default {
	migrations: {
		path: path.join(__dirname, './migrations'),
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
	entities: [Post, User],
	dbName: 'lireddit',
	user: 'postgres',
	password: 'postgres',
	type: 'postgresql',
	debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
