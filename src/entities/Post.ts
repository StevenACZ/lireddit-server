// MikroORM
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

// TypeGraphQL
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Post {
	// id
	@Field(() => Int)
	@PrimaryKey()
	id!: number;

	// createAt
	@Field(() => Date)
	@Property({ type: 'date' })
	createdAt: Date = new Date();

	// updateAt
	@Field(() => Date)
	@Property({ type: 'date', onUpdate: () => new Date() })
	updatedAt: Date = new Date();

	// title
	@Field(() => String)
	@Property({ type: 'text' })
	title!: string;
}
