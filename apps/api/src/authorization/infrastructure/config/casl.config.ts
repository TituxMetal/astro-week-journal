import { MongoAbility } from '@casl/ability'

import { Action } from '~/authorization/domain/value-objects/action.vo'

/**
 * Subjects that can be authorized in the application
 * These represent the resources that users can perform actions on
 */
export type Subjects = 'User' | 'Post' | 'Settings' | 'all'

/**
 * Application-specific Ability type using MongoAbility (CASL v6 default)
 * Combines Action enum from domain with Subjects
 * @see https://casl.js.org/v6/en/guide/intro
 */
export type AppAbility = MongoAbility<[Action, Subjects]>
