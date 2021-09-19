// Types
import { MyContext } from '../types';

// Argon2
import argon2 from 'argon2';

// TypeGraphQL
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from 'type-graphql';

// Entities
import { User } from '../entities/User';

// Username Password Input
@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;

	@Field()
	password: string;
}

// Field Error
@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

// User Response
@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	// Me
	@Query(() => UserResponse)
	async me(@Ctx() { req, em }: MyContext): Promise<UserResponse> {
		const user = await em.findOne(User, { id: req.session.userId });

		if (!user) {
			return {
				errors: [
					{
						field: 'session',
						message: 'without session',
					},
				],
			};
		}

		return { user };
	}

	// Register
	@Mutation(() => UserResponse)
	async register(
		@Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
		@Ctx() { em }: MyContext
	): Promise<UserResponse> {
		if (options.username.length <= 2) {
			return {
				errors: [
					{
						field: 'username',
						message: 'length must be greater than 2',
					},
				],
			};
		}

		if (options.password.length <= 3) {
			return {
				errors: [
					{
						field: 'password',
						message: 'length must be greater than 3',
					},
				],
			};
		}

		const username = await em.findOne(User, { username: options.username });

		if (username) {
			return {
				errors: [
					{
						field: 'username',
						message: 'username already taken',
					},
				],
			};
		}

		const hashedPassword = await argon2.hash(options.password);
		const user = em.create(User, {
			username: options.username,
			password: hashedPassword,
		});

		await em.persistAndFlush(user);

		return {
			user,
		};
	}

	// Login
	@Mutation(() => UserResponse)
	async login(
		@Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
		@Ctx() { req, em }: MyContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, { username: options.username });

		if (!user) {
			return {
				errors: [
					{
						field: 'username',
						message: "that username doesn't exist",
					},
				],
			};
		}

		const valid = await argon2.verify(user.password, options.password);

		if (!valid) {
			return {
				errors: [
					{
						field: 'password',
						message: 'incorrect password',
					},
				],
			};
		}

		req.session.userId = user.id;

		return { user };
	}
}
