// MikroORM
import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config';

// Constants
import { __prod__ } from './constants';

// Types
import { MyContext } from './types';

// Express
import express from 'express';

// Express Session
import session from 'express-session';

// Apollo Server Express
import { ApolloServer } from 'apollo-server-express';
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';

// Type GraphQL
import { buildSchema } from 'type-graphql';

// Resolvers
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

// Redis
import redis from 'redis';
import connectRedis from 'connect-redis';

const main = async () => {
	const orm = await MikroORM.init(microConfig);
	await orm.getMigrator().up();

	const app = express();

	let RedisStore = connectRedis(session);
	let redisClient = redis.createClient();

	app.use(
		session({
			name: 'qid',
			store: new RedisStore({ client: redisClient, disableTouch: true }),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: 'lax', // csrf
				secure: __prod__, // cookie only works in https
			},
			saveUninitialized: false,
			secret: 'superseguro1010',
			resave: false,
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false,
		}),
		context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
		plugins: [
			ApolloServerPluginLandingPageGraphQLPlayground({}),
			ApolloServerPluginLandingPageDisabled(),
		],
	});

	await apolloServer.start();

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => console.log('Server started on localhost:4000'));
};

main().catch(err => console.error(err));
