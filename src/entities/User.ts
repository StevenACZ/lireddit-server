// MikroORM
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

// TypeGraphQL
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
	// id
	@Field(() => Int)
	@PrimaryKey()
	id!: number;

	// createdAt
	@Field(() => String)
	@Property({ type: 'date' })
	createdAt: Date = new Date();

	// updateAt
	@Field(() => String)
	@Property({ type: 'date', onUpdate: () => new Date() })
	updatedAt: Date = new Date();

	// username
	@Field(() => String)
	@Property({ type: 'text', unique: true })
	username!: string;

	// password
	@Property({ type: 'text' })
	password!: string;
}
