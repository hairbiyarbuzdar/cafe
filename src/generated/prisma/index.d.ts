
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model KitchenStation
 * 
 */
export type KitchenStation = $Result.DefaultSelection<Prisma.$KitchenStationPayload>
/**
 * Model MenuCategory
 * 
 */
export type MenuCategory = $Result.DefaultSelection<Prisma.$MenuCategoryPayload>
/**
 * Model MenuItem
 * 
 */
export type MenuItem = $Result.DefaultSelection<Prisma.$MenuItemPayload>
/**
 * Model Supplier
 * 
 */
export type Supplier = $Result.DefaultSelection<Prisma.$SupplierPayload>
/**
 * Model InventoryItem
 * 
 */
export type InventoryItem = $Result.DefaultSelection<Prisma.$InventoryItemPayload>
/**
 * Model RecipeIngredient
 * 
 */
export type RecipeIngredient = $Result.DefaultSelection<Prisma.$RecipeIngredientPayload>
/**
 * Model InventoryMovement
 * 
 */
export type InventoryMovement = $Result.DefaultSelection<Prisma.$InventoryMovementPayload>
/**
 * Model Table
 * 
 */
export type Table = $Result.DefaultSelection<Prisma.$TablePayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model OrderItem
 * 
 */
export type OrderItem = $Result.DefaultSelection<Prisma.$OrderItemPayload>
/**
 * Model KitchenTicket
 * 
 */
export type KitchenTicket = $Result.DefaultSelection<Prisma.$KitchenTicketPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  admin: 'admin',
  manager: 'manager',
  cashier: 'cashier',
  kitchen: 'kitchen'
};

export type Role = (typeof Role)[keyof typeof Role]


export const OrderStatus: {
  pending: 'pending',
  preparing: 'preparing',
  ready: 'ready',
  completed: 'completed',
  cancelled: 'cancelled',
  refunded: 'refunded'
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]


export const PaymentMethod: {
  card: 'card',
  cash: 'cash',
  wallet: 'wallet',
  online: 'online'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const TicketStatus: {
  pending: 'pending',
  preparing: 'preparing',
  ready: 'ready',
  served: 'served'
};

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type OrderStatus = $Enums.OrderStatus

export const OrderStatus: typeof $Enums.OrderStatus

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type TicketStatus = $Enums.TicketStatus

export const TicketStatus: typeof $Enums.TicketStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kitchenStation`: Exposes CRUD operations for the **KitchenStation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KitchenStations
    * const kitchenStations = await prisma.kitchenStation.findMany()
    * ```
    */
  get kitchenStation(): Prisma.KitchenStationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.menuCategory`: Exposes CRUD operations for the **MenuCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MenuCategories
    * const menuCategories = await prisma.menuCategory.findMany()
    * ```
    */
  get menuCategory(): Prisma.MenuCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.menuItem`: Exposes CRUD operations for the **MenuItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MenuItems
    * const menuItems = await prisma.menuItem.findMany()
    * ```
    */
  get menuItem(): Prisma.MenuItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplier`: Exposes CRUD operations for the **Supplier** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Suppliers
    * const suppliers = await prisma.supplier.findMany()
    * ```
    */
  get supplier(): Prisma.SupplierDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryItem`: Exposes CRUD operations for the **InventoryItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryItems
    * const inventoryItems = await prisma.inventoryItem.findMany()
    * ```
    */
  get inventoryItem(): Prisma.InventoryItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recipeIngredient`: Exposes CRUD operations for the **RecipeIngredient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RecipeIngredients
    * const recipeIngredients = await prisma.recipeIngredient.findMany()
    * ```
    */
  get recipeIngredient(): Prisma.RecipeIngredientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryMovement`: Exposes CRUD operations for the **InventoryMovement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryMovements
    * const inventoryMovements = await prisma.inventoryMovement.findMany()
    * ```
    */
  get inventoryMovement(): Prisma.InventoryMovementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.table`: Exposes CRUD operations for the **Table** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tables
    * const tables = await prisma.table.findMany()
    * ```
    */
  get table(): Prisma.TableDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.orderItem`: Exposes CRUD operations for the **OrderItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderItems
    * const orderItems = await prisma.orderItem.findMany()
    * ```
    */
  get orderItem(): Prisma.OrderItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kitchenTicket`: Exposes CRUD operations for the **KitchenTicket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KitchenTickets
    * const kitchenTickets = await prisma.kitchenTicket.findMany()
    * ```
    */
  get kitchenTicket(): Prisma.KitchenTicketDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    KitchenStation: 'KitchenStation',
    MenuCategory: 'MenuCategory',
    MenuItem: 'MenuItem',
    Supplier: 'Supplier',
    InventoryItem: 'InventoryItem',
    RecipeIngredient: 'RecipeIngredient',
    InventoryMovement: 'InventoryMovement',
    Table: 'Table',
    Order: 'Order',
    OrderItem: 'OrderItem',
    KitchenTicket: 'KitchenTicket'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "kitchenStation" | "menuCategory" | "menuItem" | "supplier" | "inventoryItem" | "recipeIngredient" | "inventoryMovement" | "table" | "order" | "orderItem" | "kitchenTicket"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      KitchenStation: {
        payload: Prisma.$KitchenStationPayload<ExtArgs>
        fields: Prisma.KitchenStationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KitchenStationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KitchenStationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload>
          }
          findFirst: {
            args: Prisma.KitchenStationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KitchenStationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload>
          }
          findMany: {
            args: Prisma.KitchenStationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload>[]
          }
          create: {
            args: Prisma.KitchenStationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload>
          }
          createMany: {
            args: Prisma.KitchenStationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KitchenStationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload>[]
          }
          delete: {
            args: Prisma.KitchenStationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload>
          }
          update: {
            args: Prisma.KitchenStationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload>
          }
          deleteMany: {
            args: Prisma.KitchenStationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KitchenStationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KitchenStationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload>[]
          }
          upsert: {
            args: Prisma.KitchenStationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenStationPayload>
          }
          aggregate: {
            args: Prisma.KitchenStationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKitchenStation>
          }
          groupBy: {
            args: Prisma.KitchenStationGroupByArgs<ExtArgs>
            result: $Utils.Optional<KitchenStationGroupByOutputType>[]
          }
          count: {
            args: Prisma.KitchenStationCountArgs<ExtArgs>
            result: $Utils.Optional<KitchenStationCountAggregateOutputType> | number
          }
        }
      }
      MenuCategory: {
        payload: Prisma.$MenuCategoryPayload<ExtArgs>
        fields: Prisma.MenuCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MenuCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MenuCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload>
          }
          findFirst: {
            args: Prisma.MenuCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MenuCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload>
          }
          findMany: {
            args: Prisma.MenuCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload>[]
          }
          create: {
            args: Prisma.MenuCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload>
          }
          createMany: {
            args: Prisma.MenuCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MenuCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload>[]
          }
          delete: {
            args: Prisma.MenuCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload>
          }
          update: {
            args: Prisma.MenuCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload>
          }
          deleteMany: {
            args: Prisma.MenuCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MenuCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MenuCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload>[]
          }
          upsert: {
            args: Prisma.MenuCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuCategoryPayload>
          }
          aggregate: {
            args: Prisma.MenuCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMenuCategory>
          }
          groupBy: {
            args: Prisma.MenuCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<MenuCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.MenuCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<MenuCategoryCountAggregateOutputType> | number
          }
        }
      }
      MenuItem: {
        payload: Prisma.$MenuItemPayload<ExtArgs>
        fields: Prisma.MenuItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MenuItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MenuItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload>
          }
          findFirst: {
            args: Prisma.MenuItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MenuItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload>
          }
          findMany: {
            args: Prisma.MenuItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload>[]
          }
          create: {
            args: Prisma.MenuItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload>
          }
          createMany: {
            args: Prisma.MenuItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MenuItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload>[]
          }
          delete: {
            args: Prisma.MenuItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload>
          }
          update: {
            args: Prisma.MenuItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload>
          }
          deleteMany: {
            args: Prisma.MenuItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MenuItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MenuItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload>[]
          }
          upsert: {
            args: Prisma.MenuItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuItemPayload>
          }
          aggregate: {
            args: Prisma.MenuItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMenuItem>
          }
          groupBy: {
            args: Prisma.MenuItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<MenuItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.MenuItemCountArgs<ExtArgs>
            result: $Utils.Optional<MenuItemCountAggregateOutputType> | number
          }
        }
      }
      Supplier: {
        payload: Prisma.$SupplierPayload<ExtArgs>
        fields: Prisma.SupplierFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findFirst: {
            args: Prisma.SupplierFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findMany: {
            args: Prisma.SupplierFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          create: {
            args: Prisma.SupplierCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          createMany: {
            args: Prisma.SupplierCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupplierCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          delete: {
            args: Prisma.SupplierDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          update: {
            args: Prisma.SupplierUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          deleteMany: {
            args: Prisma.SupplierDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SupplierUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          upsert: {
            args: Prisma.SupplierUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          aggregate: {
            args: Prisma.SupplierAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplier>
          }
          groupBy: {
            args: Prisma.SupplierGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierCountAggregateOutputType> | number
          }
        }
      }
      InventoryItem: {
        payload: Prisma.$InventoryItemPayload<ExtArgs>
        fields: Prisma.InventoryItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          findFirst: {
            args: Prisma.InventoryItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          findMany: {
            args: Prisma.InventoryItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>[]
          }
          create: {
            args: Prisma.InventoryItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          createMany: {
            args: Prisma.InventoryItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>[]
          }
          delete: {
            args: Prisma.InventoryItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          update: {
            args: Prisma.InventoryItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          deleteMany: {
            args: Prisma.InventoryItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InventoryItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>[]
          }
          upsert: {
            args: Prisma.InventoryItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          aggregate: {
            args: Prisma.InventoryItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryItem>
          }
          groupBy: {
            args: Prisma.InventoryItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryItemCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryItemCountAggregateOutputType> | number
          }
        }
      }
      RecipeIngredient: {
        payload: Prisma.$RecipeIngredientPayload<ExtArgs>
        fields: Prisma.RecipeIngredientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecipeIngredientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecipeIngredientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload>
          }
          findFirst: {
            args: Prisma.RecipeIngredientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecipeIngredientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload>
          }
          findMany: {
            args: Prisma.RecipeIngredientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload>[]
          }
          create: {
            args: Prisma.RecipeIngredientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload>
          }
          createMany: {
            args: Prisma.RecipeIngredientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecipeIngredientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload>[]
          }
          delete: {
            args: Prisma.RecipeIngredientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload>
          }
          update: {
            args: Prisma.RecipeIngredientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload>
          }
          deleteMany: {
            args: Prisma.RecipeIngredientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecipeIngredientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecipeIngredientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload>[]
          }
          upsert: {
            args: Prisma.RecipeIngredientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipeIngredientPayload>
          }
          aggregate: {
            args: Prisma.RecipeIngredientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecipeIngredient>
          }
          groupBy: {
            args: Prisma.RecipeIngredientGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecipeIngredientGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecipeIngredientCountArgs<ExtArgs>
            result: $Utils.Optional<RecipeIngredientCountAggregateOutputType> | number
          }
        }
      }
      InventoryMovement: {
        payload: Prisma.$InventoryMovementPayload<ExtArgs>
        fields: Prisma.InventoryMovementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryMovementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryMovementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload>
          }
          findFirst: {
            args: Prisma.InventoryMovementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryMovementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload>
          }
          findMany: {
            args: Prisma.InventoryMovementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload>[]
          }
          create: {
            args: Prisma.InventoryMovementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload>
          }
          createMany: {
            args: Prisma.InventoryMovementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryMovementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload>[]
          }
          delete: {
            args: Prisma.InventoryMovementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload>
          }
          update: {
            args: Prisma.InventoryMovementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload>
          }
          deleteMany: {
            args: Prisma.InventoryMovementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryMovementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InventoryMovementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload>[]
          }
          upsert: {
            args: Prisma.InventoryMovementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryMovementPayload>
          }
          aggregate: {
            args: Prisma.InventoryMovementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryMovement>
          }
          groupBy: {
            args: Prisma.InventoryMovementGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryMovementGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryMovementCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryMovementCountAggregateOutputType> | number
          }
        }
      }
      Table: {
        payload: Prisma.$TablePayload<ExtArgs>
        fields: Prisma.TableFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TableFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TableFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload>
          }
          findFirst: {
            args: Prisma.TableFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TableFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload>
          }
          findMany: {
            args: Prisma.TableFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload>[]
          }
          create: {
            args: Prisma.TableCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload>
          }
          createMany: {
            args: Prisma.TableCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TableCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload>[]
          }
          delete: {
            args: Prisma.TableDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload>
          }
          update: {
            args: Prisma.TableUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload>
          }
          deleteMany: {
            args: Prisma.TableDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TableUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TableUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload>[]
          }
          upsert: {
            args: Prisma.TableUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TablePayload>
          }
          aggregate: {
            args: Prisma.TableAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTable>
          }
          groupBy: {
            args: Prisma.TableGroupByArgs<ExtArgs>
            result: $Utils.Optional<TableGroupByOutputType>[]
          }
          count: {
            args: Prisma.TableCountArgs<ExtArgs>
            result: $Utils.Optional<TableCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      OrderItem: {
        payload: Prisma.$OrderItemPayload<ExtArgs>
        fields: Prisma.OrderItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          findFirst: {
            args: Prisma.OrderItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          findMany: {
            args: Prisma.OrderItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>[]
          }
          create: {
            args: Prisma.OrderItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          createMany: {
            args: Prisma.OrderItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>[]
          }
          delete: {
            args: Prisma.OrderItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          update: {
            args: Prisma.OrderItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          deleteMany: {
            args: Prisma.OrderItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>[]
          }
          upsert: {
            args: Prisma.OrderItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          aggregate: {
            args: Prisma.OrderItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderItem>
          }
          groupBy: {
            args: Prisma.OrderItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderItemCountArgs<ExtArgs>
            result: $Utils.Optional<OrderItemCountAggregateOutputType> | number
          }
        }
      }
      KitchenTicket: {
        payload: Prisma.$KitchenTicketPayload<ExtArgs>
        fields: Prisma.KitchenTicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KitchenTicketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KitchenTicketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload>
          }
          findFirst: {
            args: Prisma.KitchenTicketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KitchenTicketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload>
          }
          findMany: {
            args: Prisma.KitchenTicketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload>[]
          }
          create: {
            args: Prisma.KitchenTicketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload>
          }
          createMany: {
            args: Prisma.KitchenTicketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KitchenTicketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload>[]
          }
          delete: {
            args: Prisma.KitchenTicketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload>
          }
          update: {
            args: Prisma.KitchenTicketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload>
          }
          deleteMany: {
            args: Prisma.KitchenTicketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KitchenTicketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KitchenTicketUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload>[]
          }
          upsert: {
            args: Prisma.KitchenTicketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KitchenTicketPayload>
          }
          aggregate: {
            args: Prisma.KitchenTicketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKitchenTicket>
          }
          groupBy: {
            args: Prisma.KitchenTicketGroupByArgs<ExtArgs>
            result: $Utils.Optional<KitchenTicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.KitchenTicketCountArgs<ExtArgs>
            result: $Utils.Optional<KitchenTicketCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    kitchenStation?: KitchenStationOmit
    menuCategory?: MenuCategoryOmit
    menuItem?: MenuItemOmit
    supplier?: SupplierOmit
    inventoryItem?: InventoryItemOmit
    recipeIngredient?: RecipeIngredientOmit
    inventoryMovement?: InventoryMovementOmit
    table?: TableOmit
    order?: OrderOmit
    orderItem?: OrderItemOmit
    kitchenTicket?: KitchenTicketOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    orders: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    orders?: boolean | UserCountOutputTypeCountOrdersArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }


  /**
   * Count Type KitchenStationCountOutputType
   */

  export type KitchenStationCountOutputType = {
    menuItems: number
    tickets: number
  }

  export type KitchenStationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    menuItems?: boolean | KitchenStationCountOutputTypeCountMenuItemsArgs
    tickets?: boolean | KitchenStationCountOutputTypeCountTicketsArgs
  }

  // Custom InputTypes
  /**
   * KitchenStationCountOutputType without action
   */
  export type KitchenStationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStationCountOutputType
     */
    select?: KitchenStationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * KitchenStationCountOutputType without action
   */
  export type KitchenStationCountOutputTypeCountMenuItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MenuItemWhereInput
  }

  /**
   * KitchenStationCountOutputType without action
   */
  export type KitchenStationCountOutputTypeCountTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KitchenTicketWhereInput
  }


  /**
   * Count Type MenuCategoryCountOutputType
   */

  export type MenuCategoryCountOutputType = {
    items: number
  }

  export type MenuCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | MenuCategoryCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * MenuCategoryCountOutputType without action
   */
  export type MenuCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategoryCountOutputType
     */
    select?: MenuCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MenuCategoryCountOutputType without action
   */
  export type MenuCategoryCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MenuItemWhereInput
  }


  /**
   * Count Type MenuItemCountOutputType
   */

  export type MenuItemCountOutputType = {
    recipe: number
    orderItems: number
  }

  export type MenuItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recipe?: boolean | MenuItemCountOutputTypeCountRecipeArgs
    orderItems?: boolean | MenuItemCountOutputTypeCountOrderItemsArgs
  }

  // Custom InputTypes
  /**
   * MenuItemCountOutputType without action
   */
  export type MenuItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItemCountOutputType
     */
    select?: MenuItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MenuItemCountOutputType without action
   */
  export type MenuItemCountOutputTypeCountRecipeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecipeIngredientWhereInput
  }

  /**
   * MenuItemCountOutputType without action
   */
  export type MenuItemCountOutputTypeCountOrderItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderItemWhereInput
  }


  /**
   * Count Type SupplierCountOutputType
   */

  export type SupplierCountOutputType = {
    inventoryItems: number
  }

  export type SupplierCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventoryItems?: boolean | SupplierCountOutputTypeCountInventoryItemsArgs
  }

  // Custom InputTypes
  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierCountOutputType
     */
    select?: SupplierCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeCountInventoryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryItemWhereInput
  }


  /**
   * Count Type InventoryItemCountOutputType
   */

  export type InventoryItemCountOutputType = {
    recipes: number
    movements: number
  }

  export type InventoryItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recipes?: boolean | InventoryItemCountOutputTypeCountRecipesArgs
    movements?: boolean | InventoryItemCountOutputTypeCountMovementsArgs
  }

  // Custom InputTypes
  /**
   * InventoryItemCountOutputType without action
   */
  export type InventoryItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItemCountOutputType
     */
    select?: InventoryItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InventoryItemCountOutputType without action
   */
  export type InventoryItemCountOutputTypeCountRecipesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecipeIngredientWhereInput
  }

  /**
   * InventoryItemCountOutputType without action
   */
  export type InventoryItemCountOutputTypeCountMovementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryMovementWhereInput
  }


  /**
   * Count Type TableCountOutputType
   */

  export type TableCountOutputType = {
    orders: number
  }

  export type TableCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | TableCountOutputTypeCountOrdersArgs
  }

  // Custom InputTypes
  /**
   * TableCountOutputType without action
   */
  export type TableCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TableCountOutputType
     */
    select?: TableCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TableCountOutputType without action
   */
  export type TableCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }


  /**
   * Count Type OrderCountOutputType
   */

  export type OrderCountOutputType = {
    items: number
    tickets: number
  }

  export type OrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | OrderCountOutputTypeCountItemsArgs
    tickets?: boolean | OrderCountOutputTypeCountTicketsArgs
  }

  // Custom InputTypes
  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCountOutputType
     */
    select?: OrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderItemWhereInput
  }

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KitchenTicketWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    role: number
    avatar: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatar: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    orders?: boolean | User$ordersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "role" | "avatar" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    orders?: boolean | User$ordersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      orders: Prisma.$OrderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      passwordHash: string
      role: $Enums.Role
      avatar: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    orders<T extends User$ordersArgs<ExtArgs> = {}>(args?: Subset<T, User$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.orders
   */
  export type User$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    userId: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    userId: string
    expiresAt: Date
    createdAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "expiresAt" | "createdAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model KitchenStation
   */

  export type AggregateKitchenStation = {
    _count: KitchenStationCountAggregateOutputType | null
    _min: KitchenStationMinAggregateOutputType | null
    _max: KitchenStationMaxAggregateOutputType | null
  }

  export type KitchenStationMinAggregateOutputType = {
    id: string | null
    name: string | null
    printer: string | null
    active: boolean | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KitchenStationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    printer: string | null
    active: boolean | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KitchenStationCountAggregateOutputType = {
    id: number
    name: number
    printer: number
    active: number
    color: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KitchenStationMinAggregateInputType = {
    id?: true
    name?: true
    printer?: true
    active?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KitchenStationMaxAggregateInputType = {
    id?: true
    name?: true
    printer?: true
    active?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KitchenStationCountAggregateInputType = {
    id?: true
    name?: true
    printer?: true
    active?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KitchenStationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KitchenStation to aggregate.
     */
    where?: KitchenStationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KitchenStations to fetch.
     */
    orderBy?: KitchenStationOrderByWithRelationInput | KitchenStationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KitchenStationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KitchenStations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KitchenStations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KitchenStations
    **/
    _count?: true | KitchenStationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KitchenStationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KitchenStationMaxAggregateInputType
  }

  export type GetKitchenStationAggregateType<T extends KitchenStationAggregateArgs> = {
        [P in keyof T & keyof AggregateKitchenStation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKitchenStation[P]>
      : GetScalarType<T[P], AggregateKitchenStation[P]>
  }




  export type KitchenStationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KitchenStationWhereInput
    orderBy?: KitchenStationOrderByWithAggregationInput | KitchenStationOrderByWithAggregationInput[]
    by: KitchenStationScalarFieldEnum[] | KitchenStationScalarFieldEnum
    having?: KitchenStationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KitchenStationCountAggregateInputType | true
    _min?: KitchenStationMinAggregateInputType
    _max?: KitchenStationMaxAggregateInputType
  }

  export type KitchenStationGroupByOutputType = {
    id: string
    name: string
    printer: string | null
    active: boolean
    color: string
    createdAt: Date
    updatedAt: Date
    _count: KitchenStationCountAggregateOutputType | null
    _min: KitchenStationMinAggregateOutputType | null
    _max: KitchenStationMaxAggregateOutputType | null
  }

  type GetKitchenStationGroupByPayload<T extends KitchenStationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KitchenStationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KitchenStationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KitchenStationGroupByOutputType[P]>
            : GetScalarType<T[P], KitchenStationGroupByOutputType[P]>
        }
      >
    >


  export type KitchenStationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    printer?: boolean
    active?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    menuItems?: boolean | KitchenStation$menuItemsArgs<ExtArgs>
    tickets?: boolean | KitchenStation$ticketsArgs<ExtArgs>
    _count?: boolean | KitchenStationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kitchenStation"]>

  export type KitchenStationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    printer?: boolean
    active?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["kitchenStation"]>

  export type KitchenStationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    printer?: boolean
    active?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["kitchenStation"]>

  export type KitchenStationSelectScalar = {
    id?: boolean
    name?: boolean
    printer?: boolean
    active?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KitchenStationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "printer" | "active" | "color" | "createdAt" | "updatedAt", ExtArgs["result"]["kitchenStation"]>
  export type KitchenStationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    menuItems?: boolean | KitchenStation$menuItemsArgs<ExtArgs>
    tickets?: boolean | KitchenStation$ticketsArgs<ExtArgs>
    _count?: boolean | KitchenStationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type KitchenStationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type KitchenStationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $KitchenStationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KitchenStation"
    objects: {
      menuItems: Prisma.$MenuItemPayload<ExtArgs>[]
      tickets: Prisma.$KitchenTicketPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      printer: string | null
      active: boolean
      color: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kitchenStation"]>
    composites: {}
  }

  type KitchenStationGetPayload<S extends boolean | null | undefined | KitchenStationDefaultArgs> = $Result.GetResult<Prisma.$KitchenStationPayload, S>

  type KitchenStationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KitchenStationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KitchenStationCountAggregateInputType | true
    }

  export interface KitchenStationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KitchenStation'], meta: { name: 'KitchenStation' } }
    /**
     * Find zero or one KitchenStation that matches the filter.
     * @param {KitchenStationFindUniqueArgs} args - Arguments to find a KitchenStation
     * @example
     * // Get one KitchenStation
     * const kitchenStation = await prisma.kitchenStation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KitchenStationFindUniqueArgs>(args: SelectSubset<T, KitchenStationFindUniqueArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KitchenStation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KitchenStationFindUniqueOrThrowArgs} args - Arguments to find a KitchenStation
     * @example
     * // Get one KitchenStation
     * const kitchenStation = await prisma.kitchenStation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KitchenStationFindUniqueOrThrowArgs>(args: SelectSubset<T, KitchenStationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KitchenStation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenStationFindFirstArgs} args - Arguments to find a KitchenStation
     * @example
     * // Get one KitchenStation
     * const kitchenStation = await prisma.kitchenStation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KitchenStationFindFirstArgs>(args?: SelectSubset<T, KitchenStationFindFirstArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KitchenStation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenStationFindFirstOrThrowArgs} args - Arguments to find a KitchenStation
     * @example
     * // Get one KitchenStation
     * const kitchenStation = await prisma.kitchenStation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KitchenStationFindFirstOrThrowArgs>(args?: SelectSubset<T, KitchenStationFindFirstOrThrowArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KitchenStations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenStationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KitchenStations
     * const kitchenStations = await prisma.kitchenStation.findMany()
     * 
     * // Get first 10 KitchenStations
     * const kitchenStations = await prisma.kitchenStation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kitchenStationWithIdOnly = await prisma.kitchenStation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KitchenStationFindManyArgs>(args?: SelectSubset<T, KitchenStationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KitchenStation.
     * @param {KitchenStationCreateArgs} args - Arguments to create a KitchenStation.
     * @example
     * // Create one KitchenStation
     * const KitchenStation = await prisma.kitchenStation.create({
     *   data: {
     *     // ... data to create a KitchenStation
     *   }
     * })
     * 
     */
    create<T extends KitchenStationCreateArgs>(args: SelectSubset<T, KitchenStationCreateArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KitchenStations.
     * @param {KitchenStationCreateManyArgs} args - Arguments to create many KitchenStations.
     * @example
     * // Create many KitchenStations
     * const kitchenStation = await prisma.kitchenStation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KitchenStationCreateManyArgs>(args?: SelectSubset<T, KitchenStationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KitchenStations and returns the data saved in the database.
     * @param {KitchenStationCreateManyAndReturnArgs} args - Arguments to create many KitchenStations.
     * @example
     * // Create many KitchenStations
     * const kitchenStation = await prisma.kitchenStation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KitchenStations and only return the `id`
     * const kitchenStationWithIdOnly = await prisma.kitchenStation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KitchenStationCreateManyAndReturnArgs>(args?: SelectSubset<T, KitchenStationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KitchenStation.
     * @param {KitchenStationDeleteArgs} args - Arguments to delete one KitchenStation.
     * @example
     * // Delete one KitchenStation
     * const KitchenStation = await prisma.kitchenStation.delete({
     *   where: {
     *     // ... filter to delete one KitchenStation
     *   }
     * })
     * 
     */
    delete<T extends KitchenStationDeleteArgs>(args: SelectSubset<T, KitchenStationDeleteArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KitchenStation.
     * @param {KitchenStationUpdateArgs} args - Arguments to update one KitchenStation.
     * @example
     * // Update one KitchenStation
     * const kitchenStation = await prisma.kitchenStation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KitchenStationUpdateArgs>(args: SelectSubset<T, KitchenStationUpdateArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KitchenStations.
     * @param {KitchenStationDeleteManyArgs} args - Arguments to filter KitchenStations to delete.
     * @example
     * // Delete a few KitchenStations
     * const { count } = await prisma.kitchenStation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KitchenStationDeleteManyArgs>(args?: SelectSubset<T, KitchenStationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KitchenStations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenStationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KitchenStations
     * const kitchenStation = await prisma.kitchenStation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KitchenStationUpdateManyArgs>(args: SelectSubset<T, KitchenStationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KitchenStations and returns the data updated in the database.
     * @param {KitchenStationUpdateManyAndReturnArgs} args - Arguments to update many KitchenStations.
     * @example
     * // Update many KitchenStations
     * const kitchenStation = await prisma.kitchenStation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KitchenStations and only return the `id`
     * const kitchenStationWithIdOnly = await prisma.kitchenStation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KitchenStationUpdateManyAndReturnArgs>(args: SelectSubset<T, KitchenStationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KitchenStation.
     * @param {KitchenStationUpsertArgs} args - Arguments to update or create a KitchenStation.
     * @example
     * // Update or create a KitchenStation
     * const kitchenStation = await prisma.kitchenStation.upsert({
     *   create: {
     *     // ... data to create a KitchenStation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KitchenStation we want to update
     *   }
     * })
     */
    upsert<T extends KitchenStationUpsertArgs>(args: SelectSubset<T, KitchenStationUpsertArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KitchenStations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenStationCountArgs} args - Arguments to filter KitchenStations to count.
     * @example
     * // Count the number of KitchenStations
     * const count = await prisma.kitchenStation.count({
     *   where: {
     *     // ... the filter for the KitchenStations we want to count
     *   }
     * })
    **/
    count<T extends KitchenStationCountArgs>(
      args?: Subset<T, KitchenStationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KitchenStationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KitchenStation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenStationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KitchenStationAggregateArgs>(args: Subset<T, KitchenStationAggregateArgs>): Prisma.PrismaPromise<GetKitchenStationAggregateType<T>>

    /**
     * Group by KitchenStation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenStationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KitchenStationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KitchenStationGroupByArgs['orderBy'] }
        : { orderBy?: KitchenStationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KitchenStationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKitchenStationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KitchenStation model
   */
  readonly fields: KitchenStationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KitchenStation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KitchenStationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    menuItems<T extends KitchenStation$menuItemsArgs<ExtArgs> = {}>(args?: Subset<T, KitchenStation$menuItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tickets<T extends KitchenStation$ticketsArgs<ExtArgs> = {}>(args?: Subset<T, KitchenStation$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KitchenStation model
   */
  interface KitchenStationFieldRefs {
    readonly id: FieldRef<"KitchenStation", 'String'>
    readonly name: FieldRef<"KitchenStation", 'String'>
    readonly printer: FieldRef<"KitchenStation", 'String'>
    readonly active: FieldRef<"KitchenStation", 'Boolean'>
    readonly color: FieldRef<"KitchenStation", 'String'>
    readonly createdAt: FieldRef<"KitchenStation", 'DateTime'>
    readonly updatedAt: FieldRef<"KitchenStation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KitchenStation findUnique
   */
  export type KitchenStationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
    /**
     * Filter, which KitchenStation to fetch.
     */
    where: KitchenStationWhereUniqueInput
  }

  /**
   * KitchenStation findUniqueOrThrow
   */
  export type KitchenStationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
    /**
     * Filter, which KitchenStation to fetch.
     */
    where: KitchenStationWhereUniqueInput
  }

  /**
   * KitchenStation findFirst
   */
  export type KitchenStationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
    /**
     * Filter, which KitchenStation to fetch.
     */
    where?: KitchenStationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KitchenStations to fetch.
     */
    orderBy?: KitchenStationOrderByWithRelationInput | KitchenStationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KitchenStations.
     */
    cursor?: KitchenStationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KitchenStations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KitchenStations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KitchenStations.
     */
    distinct?: KitchenStationScalarFieldEnum | KitchenStationScalarFieldEnum[]
  }

  /**
   * KitchenStation findFirstOrThrow
   */
  export type KitchenStationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
    /**
     * Filter, which KitchenStation to fetch.
     */
    where?: KitchenStationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KitchenStations to fetch.
     */
    orderBy?: KitchenStationOrderByWithRelationInput | KitchenStationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KitchenStations.
     */
    cursor?: KitchenStationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KitchenStations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KitchenStations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KitchenStations.
     */
    distinct?: KitchenStationScalarFieldEnum | KitchenStationScalarFieldEnum[]
  }

  /**
   * KitchenStation findMany
   */
  export type KitchenStationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
    /**
     * Filter, which KitchenStations to fetch.
     */
    where?: KitchenStationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KitchenStations to fetch.
     */
    orderBy?: KitchenStationOrderByWithRelationInput | KitchenStationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KitchenStations.
     */
    cursor?: KitchenStationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KitchenStations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KitchenStations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KitchenStations.
     */
    distinct?: KitchenStationScalarFieldEnum | KitchenStationScalarFieldEnum[]
  }

  /**
   * KitchenStation create
   */
  export type KitchenStationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
    /**
     * The data needed to create a KitchenStation.
     */
    data: XOR<KitchenStationCreateInput, KitchenStationUncheckedCreateInput>
  }

  /**
   * KitchenStation createMany
   */
  export type KitchenStationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KitchenStations.
     */
    data: KitchenStationCreateManyInput | KitchenStationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KitchenStation createManyAndReturn
   */
  export type KitchenStationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * The data used to create many KitchenStations.
     */
    data: KitchenStationCreateManyInput | KitchenStationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KitchenStation update
   */
  export type KitchenStationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
    /**
     * The data needed to update a KitchenStation.
     */
    data: XOR<KitchenStationUpdateInput, KitchenStationUncheckedUpdateInput>
    /**
     * Choose, which KitchenStation to update.
     */
    where: KitchenStationWhereUniqueInput
  }

  /**
   * KitchenStation updateMany
   */
  export type KitchenStationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KitchenStations.
     */
    data: XOR<KitchenStationUpdateManyMutationInput, KitchenStationUncheckedUpdateManyInput>
    /**
     * Filter which KitchenStations to update
     */
    where?: KitchenStationWhereInput
    /**
     * Limit how many KitchenStations to update.
     */
    limit?: number
  }

  /**
   * KitchenStation updateManyAndReturn
   */
  export type KitchenStationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * The data used to update KitchenStations.
     */
    data: XOR<KitchenStationUpdateManyMutationInput, KitchenStationUncheckedUpdateManyInput>
    /**
     * Filter which KitchenStations to update
     */
    where?: KitchenStationWhereInput
    /**
     * Limit how many KitchenStations to update.
     */
    limit?: number
  }

  /**
   * KitchenStation upsert
   */
  export type KitchenStationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
    /**
     * The filter to search for the KitchenStation to update in case it exists.
     */
    where: KitchenStationWhereUniqueInput
    /**
     * In case the KitchenStation found by the `where` argument doesn't exist, create a new KitchenStation with this data.
     */
    create: XOR<KitchenStationCreateInput, KitchenStationUncheckedCreateInput>
    /**
     * In case the KitchenStation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KitchenStationUpdateInput, KitchenStationUncheckedUpdateInput>
  }

  /**
   * KitchenStation delete
   */
  export type KitchenStationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
    /**
     * Filter which KitchenStation to delete.
     */
    where: KitchenStationWhereUniqueInput
  }

  /**
   * KitchenStation deleteMany
   */
  export type KitchenStationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KitchenStations to delete
     */
    where?: KitchenStationWhereInput
    /**
     * Limit how many KitchenStations to delete.
     */
    limit?: number
  }

  /**
   * KitchenStation.menuItems
   */
  export type KitchenStation$menuItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    where?: MenuItemWhereInput
    orderBy?: MenuItemOrderByWithRelationInput | MenuItemOrderByWithRelationInput[]
    cursor?: MenuItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MenuItemScalarFieldEnum | MenuItemScalarFieldEnum[]
  }

  /**
   * KitchenStation.tickets
   */
  export type KitchenStation$ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    where?: KitchenTicketWhereInput
    orderBy?: KitchenTicketOrderByWithRelationInput | KitchenTicketOrderByWithRelationInput[]
    cursor?: KitchenTicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KitchenTicketScalarFieldEnum | KitchenTicketScalarFieldEnum[]
  }

  /**
   * KitchenStation without action
   */
  export type KitchenStationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenStation
     */
    select?: KitchenStationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenStation
     */
    omit?: KitchenStationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenStationInclude<ExtArgs> | null
  }


  /**
   * Model MenuCategory
   */

  export type AggregateMenuCategory = {
    _count: MenuCategoryCountAggregateOutputType | null
    _min: MenuCategoryMinAggregateOutputType | null
    _max: MenuCategoryMaxAggregateOutputType | null
  }

  export type MenuCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    color: string | null
    createdAt: Date | null
  }

  export type MenuCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    color: string | null
    createdAt: Date | null
  }

  export type MenuCategoryCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    color: number
    createdAt: number
    _all: number
  }


  export type MenuCategoryMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    color?: true
    createdAt?: true
  }

  export type MenuCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    color?: true
    createdAt?: true
  }

  export type MenuCategoryCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    color?: true
    createdAt?: true
    _all?: true
  }

  export type MenuCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MenuCategory to aggregate.
     */
    where?: MenuCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MenuCategories to fetch.
     */
    orderBy?: MenuCategoryOrderByWithRelationInput | MenuCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MenuCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MenuCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MenuCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MenuCategories
    **/
    _count?: true | MenuCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MenuCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MenuCategoryMaxAggregateInputType
  }

  export type GetMenuCategoryAggregateType<T extends MenuCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateMenuCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMenuCategory[P]>
      : GetScalarType<T[P], AggregateMenuCategory[P]>
  }




  export type MenuCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MenuCategoryWhereInput
    orderBy?: MenuCategoryOrderByWithAggregationInput | MenuCategoryOrderByWithAggregationInput[]
    by: MenuCategoryScalarFieldEnum[] | MenuCategoryScalarFieldEnum
    having?: MenuCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MenuCategoryCountAggregateInputType | true
    _min?: MenuCategoryMinAggregateInputType
    _max?: MenuCategoryMaxAggregateInputType
  }

  export type MenuCategoryGroupByOutputType = {
    id: string
    name: string
    slug: string
    color: string
    createdAt: Date
    _count: MenuCategoryCountAggregateOutputType | null
    _min: MenuCategoryMinAggregateOutputType | null
    _max: MenuCategoryMaxAggregateOutputType | null
  }

  type GetMenuCategoryGroupByPayload<T extends MenuCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MenuCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MenuCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MenuCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], MenuCategoryGroupByOutputType[P]>
        }
      >
    >


  export type MenuCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    color?: boolean
    createdAt?: boolean
    items?: boolean | MenuCategory$itemsArgs<ExtArgs>
    _count?: boolean | MenuCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["menuCategory"]>

  export type MenuCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    color?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["menuCategory"]>

  export type MenuCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    color?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["menuCategory"]>

  export type MenuCategorySelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    color?: boolean
    createdAt?: boolean
  }

  export type MenuCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "color" | "createdAt", ExtArgs["result"]["menuCategory"]>
  export type MenuCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | MenuCategory$itemsArgs<ExtArgs>
    _count?: boolean | MenuCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MenuCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MenuCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MenuCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MenuCategory"
    objects: {
      items: Prisma.$MenuItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      color: string
      createdAt: Date
    }, ExtArgs["result"]["menuCategory"]>
    composites: {}
  }

  type MenuCategoryGetPayload<S extends boolean | null | undefined | MenuCategoryDefaultArgs> = $Result.GetResult<Prisma.$MenuCategoryPayload, S>

  type MenuCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MenuCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MenuCategoryCountAggregateInputType | true
    }

  export interface MenuCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MenuCategory'], meta: { name: 'MenuCategory' } }
    /**
     * Find zero or one MenuCategory that matches the filter.
     * @param {MenuCategoryFindUniqueArgs} args - Arguments to find a MenuCategory
     * @example
     * // Get one MenuCategory
     * const menuCategory = await prisma.menuCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MenuCategoryFindUniqueArgs>(args: SelectSubset<T, MenuCategoryFindUniqueArgs<ExtArgs>>): Prisma__MenuCategoryClient<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MenuCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MenuCategoryFindUniqueOrThrowArgs} args - Arguments to find a MenuCategory
     * @example
     * // Get one MenuCategory
     * const menuCategory = await prisma.menuCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MenuCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, MenuCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MenuCategoryClient<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MenuCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuCategoryFindFirstArgs} args - Arguments to find a MenuCategory
     * @example
     * // Get one MenuCategory
     * const menuCategory = await prisma.menuCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MenuCategoryFindFirstArgs>(args?: SelectSubset<T, MenuCategoryFindFirstArgs<ExtArgs>>): Prisma__MenuCategoryClient<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MenuCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuCategoryFindFirstOrThrowArgs} args - Arguments to find a MenuCategory
     * @example
     * // Get one MenuCategory
     * const menuCategory = await prisma.menuCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MenuCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, MenuCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__MenuCategoryClient<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MenuCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MenuCategories
     * const menuCategories = await prisma.menuCategory.findMany()
     * 
     * // Get first 10 MenuCategories
     * const menuCategories = await prisma.menuCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const menuCategoryWithIdOnly = await prisma.menuCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MenuCategoryFindManyArgs>(args?: SelectSubset<T, MenuCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MenuCategory.
     * @param {MenuCategoryCreateArgs} args - Arguments to create a MenuCategory.
     * @example
     * // Create one MenuCategory
     * const MenuCategory = await prisma.menuCategory.create({
     *   data: {
     *     // ... data to create a MenuCategory
     *   }
     * })
     * 
     */
    create<T extends MenuCategoryCreateArgs>(args: SelectSubset<T, MenuCategoryCreateArgs<ExtArgs>>): Prisma__MenuCategoryClient<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MenuCategories.
     * @param {MenuCategoryCreateManyArgs} args - Arguments to create many MenuCategories.
     * @example
     * // Create many MenuCategories
     * const menuCategory = await prisma.menuCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MenuCategoryCreateManyArgs>(args?: SelectSubset<T, MenuCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MenuCategories and returns the data saved in the database.
     * @param {MenuCategoryCreateManyAndReturnArgs} args - Arguments to create many MenuCategories.
     * @example
     * // Create many MenuCategories
     * const menuCategory = await prisma.menuCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MenuCategories and only return the `id`
     * const menuCategoryWithIdOnly = await prisma.menuCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MenuCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, MenuCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MenuCategory.
     * @param {MenuCategoryDeleteArgs} args - Arguments to delete one MenuCategory.
     * @example
     * // Delete one MenuCategory
     * const MenuCategory = await prisma.menuCategory.delete({
     *   where: {
     *     // ... filter to delete one MenuCategory
     *   }
     * })
     * 
     */
    delete<T extends MenuCategoryDeleteArgs>(args: SelectSubset<T, MenuCategoryDeleteArgs<ExtArgs>>): Prisma__MenuCategoryClient<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MenuCategory.
     * @param {MenuCategoryUpdateArgs} args - Arguments to update one MenuCategory.
     * @example
     * // Update one MenuCategory
     * const menuCategory = await prisma.menuCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MenuCategoryUpdateArgs>(args: SelectSubset<T, MenuCategoryUpdateArgs<ExtArgs>>): Prisma__MenuCategoryClient<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MenuCategories.
     * @param {MenuCategoryDeleteManyArgs} args - Arguments to filter MenuCategories to delete.
     * @example
     * // Delete a few MenuCategories
     * const { count } = await prisma.menuCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MenuCategoryDeleteManyArgs>(args?: SelectSubset<T, MenuCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MenuCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MenuCategories
     * const menuCategory = await prisma.menuCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MenuCategoryUpdateManyArgs>(args: SelectSubset<T, MenuCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MenuCategories and returns the data updated in the database.
     * @param {MenuCategoryUpdateManyAndReturnArgs} args - Arguments to update many MenuCategories.
     * @example
     * // Update many MenuCategories
     * const menuCategory = await prisma.menuCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MenuCategories and only return the `id`
     * const menuCategoryWithIdOnly = await prisma.menuCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MenuCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, MenuCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MenuCategory.
     * @param {MenuCategoryUpsertArgs} args - Arguments to update or create a MenuCategory.
     * @example
     * // Update or create a MenuCategory
     * const menuCategory = await prisma.menuCategory.upsert({
     *   create: {
     *     // ... data to create a MenuCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MenuCategory we want to update
     *   }
     * })
     */
    upsert<T extends MenuCategoryUpsertArgs>(args: SelectSubset<T, MenuCategoryUpsertArgs<ExtArgs>>): Prisma__MenuCategoryClient<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MenuCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuCategoryCountArgs} args - Arguments to filter MenuCategories to count.
     * @example
     * // Count the number of MenuCategories
     * const count = await prisma.menuCategory.count({
     *   where: {
     *     // ... the filter for the MenuCategories we want to count
     *   }
     * })
    **/
    count<T extends MenuCategoryCountArgs>(
      args?: Subset<T, MenuCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MenuCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MenuCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MenuCategoryAggregateArgs>(args: Subset<T, MenuCategoryAggregateArgs>): Prisma.PrismaPromise<GetMenuCategoryAggregateType<T>>

    /**
     * Group by MenuCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MenuCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MenuCategoryGroupByArgs['orderBy'] }
        : { orderBy?: MenuCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MenuCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMenuCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MenuCategory model
   */
  readonly fields: MenuCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MenuCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MenuCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends MenuCategory$itemsArgs<ExtArgs> = {}>(args?: Subset<T, MenuCategory$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MenuCategory model
   */
  interface MenuCategoryFieldRefs {
    readonly id: FieldRef<"MenuCategory", 'String'>
    readonly name: FieldRef<"MenuCategory", 'String'>
    readonly slug: FieldRef<"MenuCategory", 'String'>
    readonly color: FieldRef<"MenuCategory", 'String'>
    readonly createdAt: FieldRef<"MenuCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MenuCategory findUnique
   */
  export type MenuCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
    /**
     * Filter, which MenuCategory to fetch.
     */
    where: MenuCategoryWhereUniqueInput
  }

  /**
   * MenuCategory findUniqueOrThrow
   */
  export type MenuCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
    /**
     * Filter, which MenuCategory to fetch.
     */
    where: MenuCategoryWhereUniqueInput
  }

  /**
   * MenuCategory findFirst
   */
  export type MenuCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
    /**
     * Filter, which MenuCategory to fetch.
     */
    where?: MenuCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MenuCategories to fetch.
     */
    orderBy?: MenuCategoryOrderByWithRelationInput | MenuCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MenuCategories.
     */
    cursor?: MenuCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MenuCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MenuCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MenuCategories.
     */
    distinct?: MenuCategoryScalarFieldEnum | MenuCategoryScalarFieldEnum[]
  }

  /**
   * MenuCategory findFirstOrThrow
   */
  export type MenuCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
    /**
     * Filter, which MenuCategory to fetch.
     */
    where?: MenuCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MenuCategories to fetch.
     */
    orderBy?: MenuCategoryOrderByWithRelationInput | MenuCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MenuCategories.
     */
    cursor?: MenuCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MenuCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MenuCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MenuCategories.
     */
    distinct?: MenuCategoryScalarFieldEnum | MenuCategoryScalarFieldEnum[]
  }

  /**
   * MenuCategory findMany
   */
  export type MenuCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
    /**
     * Filter, which MenuCategories to fetch.
     */
    where?: MenuCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MenuCategories to fetch.
     */
    orderBy?: MenuCategoryOrderByWithRelationInput | MenuCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MenuCategories.
     */
    cursor?: MenuCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MenuCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MenuCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MenuCategories.
     */
    distinct?: MenuCategoryScalarFieldEnum | MenuCategoryScalarFieldEnum[]
  }

  /**
   * MenuCategory create
   */
  export type MenuCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a MenuCategory.
     */
    data: XOR<MenuCategoryCreateInput, MenuCategoryUncheckedCreateInput>
  }

  /**
   * MenuCategory createMany
   */
  export type MenuCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MenuCategories.
     */
    data: MenuCategoryCreateManyInput | MenuCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MenuCategory createManyAndReturn
   */
  export type MenuCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many MenuCategories.
     */
    data: MenuCategoryCreateManyInput | MenuCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MenuCategory update
   */
  export type MenuCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a MenuCategory.
     */
    data: XOR<MenuCategoryUpdateInput, MenuCategoryUncheckedUpdateInput>
    /**
     * Choose, which MenuCategory to update.
     */
    where: MenuCategoryWhereUniqueInput
  }

  /**
   * MenuCategory updateMany
   */
  export type MenuCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MenuCategories.
     */
    data: XOR<MenuCategoryUpdateManyMutationInput, MenuCategoryUncheckedUpdateManyInput>
    /**
     * Filter which MenuCategories to update
     */
    where?: MenuCategoryWhereInput
    /**
     * Limit how many MenuCategories to update.
     */
    limit?: number
  }

  /**
   * MenuCategory updateManyAndReturn
   */
  export type MenuCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * The data used to update MenuCategories.
     */
    data: XOR<MenuCategoryUpdateManyMutationInput, MenuCategoryUncheckedUpdateManyInput>
    /**
     * Filter which MenuCategories to update
     */
    where?: MenuCategoryWhereInput
    /**
     * Limit how many MenuCategories to update.
     */
    limit?: number
  }

  /**
   * MenuCategory upsert
   */
  export type MenuCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the MenuCategory to update in case it exists.
     */
    where: MenuCategoryWhereUniqueInput
    /**
     * In case the MenuCategory found by the `where` argument doesn't exist, create a new MenuCategory with this data.
     */
    create: XOR<MenuCategoryCreateInput, MenuCategoryUncheckedCreateInput>
    /**
     * In case the MenuCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MenuCategoryUpdateInput, MenuCategoryUncheckedUpdateInput>
  }

  /**
   * MenuCategory delete
   */
  export type MenuCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
    /**
     * Filter which MenuCategory to delete.
     */
    where: MenuCategoryWhereUniqueInput
  }

  /**
   * MenuCategory deleteMany
   */
  export type MenuCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MenuCategories to delete
     */
    where?: MenuCategoryWhereInput
    /**
     * Limit how many MenuCategories to delete.
     */
    limit?: number
  }

  /**
   * MenuCategory.items
   */
  export type MenuCategory$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    where?: MenuItemWhereInput
    orderBy?: MenuItemOrderByWithRelationInput | MenuItemOrderByWithRelationInput[]
    cursor?: MenuItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MenuItemScalarFieldEnum | MenuItemScalarFieldEnum[]
  }

  /**
   * MenuCategory without action
   */
  export type MenuCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCategory
     */
    select?: MenuCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuCategory
     */
    omit?: MenuCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuCategoryInclude<ExtArgs> | null
  }


  /**
   * Model MenuItem
   */

  export type AggregateMenuItem = {
    _count: MenuItemCountAggregateOutputType | null
    _avg: MenuItemAvgAggregateOutputType | null
    _sum: MenuItemSumAggregateOutputType | null
    _min: MenuItemMinAggregateOutputType | null
    _max: MenuItemMaxAggregateOutputType | null
  }

  export type MenuItemAvgAggregateOutputType = {
    price: Decimal | null
    prepTimeMinutes: number | null
  }

  export type MenuItemSumAggregateOutputType = {
    price: Decimal | null
    prepTimeMinutes: number | null
  }

  export type MenuItemMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    price: Decimal | null
    sku: string | null
    available: boolean | null
    posVisible: boolean | null
    popular: boolean | null
    prepTimeMinutes: number | null
    image: string | null
    categoryId: string | null
    stationId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MenuItemMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    price: Decimal | null
    sku: string | null
    available: boolean | null
    posVisible: boolean | null
    popular: boolean | null
    prepTimeMinutes: number | null
    image: string | null
    categoryId: string | null
    stationId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MenuItemCountAggregateOutputType = {
    id: number
    name: number
    description: number
    price: number
    sku: number
    available: number
    posVisible: number
    popular: number
    prepTimeMinutes: number
    image: number
    categoryId: number
    stationId: number
    modifiers: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MenuItemAvgAggregateInputType = {
    price?: true
    prepTimeMinutes?: true
  }

  export type MenuItemSumAggregateInputType = {
    price?: true
    prepTimeMinutes?: true
  }

  export type MenuItemMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    sku?: true
    available?: true
    posVisible?: true
    popular?: true
    prepTimeMinutes?: true
    image?: true
    categoryId?: true
    stationId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MenuItemMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    sku?: true
    available?: true
    posVisible?: true
    popular?: true
    prepTimeMinutes?: true
    image?: true
    categoryId?: true
    stationId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MenuItemCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    sku?: true
    available?: true
    posVisible?: true
    popular?: true
    prepTimeMinutes?: true
    image?: true
    categoryId?: true
    stationId?: true
    modifiers?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MenuItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MenuItem to aggregate.
     */
    where?: MenuItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MenuItems to fetch.
     */
    orderBy?: MenuItemOrderByWithRelationInput | MenuItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MenuItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MenuItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MenuItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MenuItems
    **/
    _count?: true | MenuItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MenuItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MenuItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MenuItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MenuItemMaxAggregateInputType
  }

  export type GetMenuItemAggregateType<T extends MenuItemAggregateArgs> = {
        [P in keyof T & keyof AggregateMenuItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMenuItem[P]>
      : GetScalarType<T[P], AggregateMenuItem[P]>
  }




  export type MenuItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MenuItemWhereInput
    orderBy?: MenuItemOrderByWithAggregationInput | MenuItemOrderByWithAggregationInput[]
    by: MenuItemScalarFieldEnum[] | MenuItemScalarFieldEnum
    having?: MenuItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MenuItemCountAggregateInputType | true
    _avg?: MenuItemAvgAggregateInputType
    _sum?: MenuItemSumAggregateInputType
    _min?: MenuItemMinAggregateInputType
    _max?: MenuItemMaxAggregateInputType
  }

  export type MenuItemGroupByOutputType = {
    id: string
    name: string
    description: string | null
    price: Decimal
    sku: string | null
    available: boolean
    posVisible: boolean
    popular: boolean
    prepTimeMinutes: number | null
    image: string | null
    categoryId: string
    stationId: string
    modifiers: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: MenuItemCountAggregateOutputType | null
    _avg: MenuItemAvgAggregateOutputType | null
    _sum: MenuItemSumAggregateOutputType | null
    _min: MenuItemMinAggregateOutputType | null
    _max: MenuItemMaxAggregateOutputType | null
  }

  type GetMenuItemGroupByPayload<T extends MenuItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MenuItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MenuItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MenuItemGroupByOutputType[P]>
            : GetScalarType<T[P], MenuItemGroupByOutputType[P]>
        }
      >
    >


  export type MenuItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    sku?: boolean
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: boolean
    image?: boolean
    categoryId?: boolean
    stationId?: boolean
    modifiers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | MenuCategoryDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
    recipe?: boolean | MenuItem$recipeArgs<ExtArgs>
    orderItems?: boolean | MenuItem$orderItemsArgs<ExtArgs>
    _count?: boolean | MenuItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["menuItem"]>

  export type MenuItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    sku?: boolean
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: boolean
    image?: boolean
    categoryId?: boolean
    stationId?: boolean
    modifiers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | MenuCategoryDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["menuItem"]>

  export type MenuItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    sku?: boolean
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: boolean
    image?: boolean
    categoryId?: boolean
    stationId?: boolean
    modifiers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | MenuCategoryDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["menuItem"]>

  export type MenuItemSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    sku?: boolean
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: boolean
    image?: boolean
    categoryId?: boolean
    stationId?: boolean
    modifiers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MenuItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "price" | "sku" | "available" | "posVisible" | "popular" | "prepTimeMinutes" | "image" | "categoryId" | "stationId" | "modifiers" | "createdAt" | "updatedAt", ExtArgs["result"]["menuItem"]>
  export type MenuItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | MenuCategoryDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
    recipe?: boolean | MenuItem$recipeArgs<ExtArgs>
    orderItems?: boolean | MenuItem$orderItemsArgs<ExtArgs>
    _count?: boolean | MenuItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MenuItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | MenuCategoryDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }
  export type MenuItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | MenuCategoryDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }

  export type $MenuItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MenuItem"
    objects: {
      category: Prisma.$MenuCategoryPayload<ExtArgs>
      station: Prisma.$KitchenStationPayload<ExtArgs>
      recipe: Prisma.$RecipeIngredientPayload<ExtArgs>[]
      orderItems: Prisma.$OrderItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      price: Prisma.Decimal
      sku: string | null
      available: boolean
      posVisible: boolean
      popular: boolean
      prepTimeMinutes: number | null
      image: string | null
      categoryId: string
      stationId: string
      modifiers: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["menuItem"]>
    composites: {}
  }

  type MenuItemGetPayload<S extends boolean | null | undefined | MenuItemDefaultArgs> = $Result.GetResult<Prisma.$MenuItemPayload, S>

  type MenuItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MenuItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MenuItemCountAggregateInputType | true
    }

  export interface MenuItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MenuItem'], meta: { name: 'MenuItem' } }
    /**
     * Find zero or one MenuItem that matches the filter.
     * @param {MenuItemFindUniqueArgs} args - Arguments to find a MenuItem
     * @example
     * // Get one MenuItem
     * const menuItem = await prisma.menuItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MenuItemFindUniqueArgs>(args: SelectSubset<T, MenuItemFindUniqueArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MenuItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MenuItemFindUniqueOrThrowArgs} args - Arguments to find a MenuItem
     * @example
     * // Get one MenuItem
     * const menuItem = await prisma.menuItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MenuItemFindUniqueOrThrowArgs>(args: SelectSubset<T, MenuItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MenuItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuItemFindFirstArgs} args - Arguments to find a MenuItem
     * @example
     * // Get one MenuItem
     * const menuItem = await prisma.menuItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MenuItemFindFirstArgs>(args?: SelectSubset<T, MenuItemFindFirstArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MenuItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuItemFindFirstOrThrowArgs} args - Arguments to find a MenuItem
     * @example
     * // Get one MenuItem
     * const menuItem = await prisma.menuItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MenuItemFindFirstOrThrowArgs>(args?: SelectSubset<T, MenuItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MenuItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MenuItems
     * const menuItems = await prisma.menuItem.findMany()
     * 
     * // Get first 10 MenuItems
     * const menuItems = await prisma.menuItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const menuItemWithIdOnly = await prisma.menuItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MenuItemFindManyArgs>(args?: SelectSubset<T, MenuItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MenuItem.
     * @param {MenuItemCreateArgs} args - Arguments to create a MenuItem.
     * @example
     * // Create one MenuItem
     * const MenuItem = await prisma.menuItem.create({
     *   data: {
     *     // ... data to create a MenuItem
     *   }
     * })
     * 
     */
    create<T extends MenuItemCreateArgs>(args: SelectSubset<T, MenuItemCreateArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MenuItems.
     * @param {MenuItemCreateManyArgs} args - Arguments to create many MenuItems.
     * @example
     * // Create many MenuItems
     * const menuItem = await prisma.menuItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MenuItemCreateManyArgs>(args?: SelectSubset<T, MenuItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MenuItems and returns the data saved in the database.
     * @param {MenuItemCreateManyAndReturnArgs} args - Arguments to create many MenuItems.
     * @example
     * // Create many MenuItems
     * const menuItem = await prisma.menuItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MenuItems and only return the `id`
     * const menuItemWithIdOnly = await prisma.menuItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MenuItemCreateManyAndReturnArgs>(args?: SelectSubset<T, MenuItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MenuItem.
     * @param {MenuItemDeleteArgs} args - Arguments to delete one MenuItem.
     * @example
     * // Delete one MenuItem
     * const MenuItem = await prisma.menuItem.delete({
     *   where: {
     *     // ... filter to delete one MenuItem
     *   }
     * })
     * 
     */
    delete<T extends MenuItemDeleteArgs>(args: SelectSubset<T, MenuItemDeleteArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MenuItem.
     * @param {MenuItemUpdateArgs} args - Arguments to update one MenuItem.
     * @example
     * // Update one MenuItem
     * const menuItem = await prisma.menuItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MenuItemUpdateArgs>(args: SelectSubset<T, MenuItemUpdateArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MenuItems.
     * @param {MenuItemDeleteManyArgs} args - Arguments to filter MenuItems to delete.
     * @example
     * // Delete a few MenuItems
     * const { count } = await prisma.menuItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MenuItemDeleteManyArgs>(args?: SelectSubset<T, MenuItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MenuItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MenuItems
     * const menuItem = await prisma.menuItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MenuItemUpdateManyArgs>(args: SelectSubset<T, MenuItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MenuItems and returns the data updated in the database.
     * @param {MenuItemUpdateManyAndReturnArgs} args - Arguments to update many MenuItems.
     * @example
     * // Update many MenuItems
     * const menuItem = await prisma.menuItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MenuItems and only return the `id`
     * const menuItemWithIdOnly = await prisma.menuItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MenuItemUpdateManyAndReturnArgs>(args: SelectSubset<T, MenuItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MenuItem.
     * @param {MenuItemUpsertArgs} args - Arguments to update or create a MenuItem.
     * @example
     * // Update or create a MenuItem
     * const menuItem = await prisma.menuItem.upsert({
     *   create: {
     *     // ... data to create a MenuItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MenuItem we want to update
     *   }
     * })
     */
    upsert<T extends MenuItemUpsertArgs>(args: SelectSubset<T, MenuItemUpsertArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MenuItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuItemCountArgs} args - Arguments to filter MenuItems to count.
     * @example
     * // Count the number of MenuItems
     * const count = await prisma.menuItem.count({
     *   where: {
     *     // ... the filter for the MenuItems we want to count
     *   }
     * })
    **/
    count<T extends MenuItemCountArgs>(
      args?: Subset<T, MenuItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MenuItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MenuItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MenuItemAggregateArgs>(args: Subset<T, MenuItemAggregateArgs>): Prisma.PrismaPromise<GetMenuItemAggregateType<T>>

    /**
     * Group by MenuItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MenuItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MenuItemGroupByArgs['orderBy'] }
        : { orderBy?: MenuItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MenuItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMenuItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MenuItem model
   */
  readonly fields: MenuItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MenuItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MenuItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends MenuCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MenuCategoryDefaultArgs<ExtArgs>>): Prisma__MenuCategoryClient<$Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    station<T extends KitchenStationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KitchenStationDefaultArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    recipe<T extends MenuItem$recipeArgs<ExtArgs> = {}>(args?: Subset<T, MenuItem$recipeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    orderItems<T extends MenuItem$orderItemsArgs<ExtArgs> = {}>(args?: Subset<T, MenuItem$orderItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MenuItem model
   */
  interface MenuItemFieldRefs {
    readonly id: FieldRef<"MenuItem", 'String'>
    readonly name: FieldRef<"MenuItem", 'String'>
    readonly description: FieldRef<"MenuItem", 'String'>
    readonly price: FieldRef<"MenuItem", 'Decimal'>
    readonly sku: FieldRef<"MenuItem", 'String'>
    readonly available: FieldRef<"MenuItem", 'Boolean'>
    readonly posVisible: FieldRef<"MenuItem", 'Boolean'>
    readonly popular: FieldRef<"MenuItem", 'Boolean'>
    readonly prepTimeMinutes: FieldRef<"MenuItem", 'Int'>
    readonly image: FieldRef<"MenuItem", 'String'>
    readonly categoryId: FieldRef<"MenuItem", 'String'>
    readonly stationId: FieldRef<"MenuItem", 'String'>
    readonly modifiers: FieldRef<"MenuItem", 'Json'>
    readonly createdAt: FieldRef<"MenuItem", 'DateTime'>
    readonly updatedAt: FieldRef<"MenuItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MenuItem findUnique
   */
  export type MenuItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    /**
     * Filter, which MenuItem to fetch.
     */
    where: MenuItemWhereUniqueInput
  }

  /**
   * MenuItem findUniqueOrThrow
   */
  export type MenuItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    /**
     * Filter, which MenuItem to fetch.
     */
    where: MenuItemWhereUniqueInput
  }

  /**
   * MenuItem findFirst
   */
  export type MenuItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    /**
     * Filter, which MenuItem to fetch.
     */
    where?: MenuItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MenuItems to fetch.
     */
    orderBy?: MenuItemOrderByWithRelationInput | MenuItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MenuItems.
     */
    cursor?: MenuItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MenuItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MenuItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MenuItems.
     */
    distinct?: MenuItemScalarFieldEnum | MenuItemScalarFieldEnum[]
  }

  /**
   * MenuItem findFirstOrThrow
   */
  export type MenuItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    /**
     * Filter, which MenuItem to fetch.
     */
    where?: MenuItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MenuItems to fetch.
     */
    orderBy?: MenuItemOrderByWithRelationInput | MenuItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MenuItems.
     */
    cursor?: MenuItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MenuItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MenuItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MenuItems.
     */
    distinct?: MenuItemScalarFieldEnum | MenuItemScalarFieldEnum[]
  }

  /**
   * MenuItem findMany
   */
  export type MenuItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    /**
     * Filter, which MenuItems to fetch.
     */
    where?: MenuItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MenuItems to fetch.
     */
    orderBy?: MenuItemOrderByWithRelationInput | MenuItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MenuItems.
     */
    cursor?: MenuItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MenuItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MenuItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MenuItems.
     */
    distinct?: MenuItemScalarFieldEnum | MenuItemScalarFieldEnum[]
  }

  /**
   * MenuItem create
   */
  export type MenuItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    /**
     * The data needed to create a MenuItem.
     */
    data: XOR<MenuItemCreateInput, MenuItemUncheckedCreateInput>
  }

  /**
   * MenuItem createMany
   */
  export type MenuItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MenuItems.
     */
    data: MenuItemCreateManyInput | MenuItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MenuItem createManyAndReturn
   */
  export type MenuItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * The data used to create many MenuItems.
     */
    data: MenuItemCreateManyInput | MenuItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MenuItem update
   */
  export type MenuItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    /**
     * The data needed to update a MenuItem.
     */
    data: XOR<MenuItemUpdateInput, MenuItemUncheckedUpdateInput>
    /**
     * Choose, which MenuItem to update.
     */
    where: MenuItemWhereUniqueInput
  }

  /**
   * MenuItem updateMany
   */
  export type MenuItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MenuItems.
     */
    data: XOR<MenuItemUpdateManyMutationInput, MenuItemUncheckedUpdateManyInput>
    /**
     * Filter which MenuItems to update
     */
    where?: MenuItemWhereInput
    /**
     * Limit how many MenuItems to update.
     */
    limit?: number
  }

  /**
   * MenuItem updateManyAndReturn
   */
  export type MenuItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * The data used to update MenuItems.
     */
    data: XOR<MenuItemUpdateManyMutationInput, MenuItemUncheckedUpdateManyInput>
    /**
     * Filter which MenuItems to update
     */
    where?: MenuItemWhereInput
    /**
     * Limit how many MenuItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MenuItem upsert
   */
  export type MenuItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    /**
     * The filter to search for the MenuItem to update in case it exists.
     */
    where: MenuItemWhereUniqueInput
    /**
     * In case the MenuItem found by the `where` argument doesn't exist, create a new MenuItem with this data.
     */
    create: XOR<MenuItemCreateInput, MenuItemUncheckedCreateInput>
    /**
     * In case the MenuItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MenuItemUpdateInput, MenuItemUncheckedUpdateInput>
  }

  /**
   * MenuItem delete
   */
  export type MenuItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
    /**
     * Filter which MenuItem to delete.
     */
    where: MenuItemWhereUniqueInput
  }

  /**
   * MenuItem deleteMany
   */
  export type MenuItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MenuItems to delete
     */
    where?: MenuItemWhereInput
    /**
     * Limit how many MenuItems to delete.
     */
    limit?: number
  }

  /**
   * MenuItem.recipe
   */
  export type MenuItem$recipeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    where?: RecipeIngredientWhereInput
    orderBy?: RecipeIngredientOrderByWithRelationInput | RecipeIngredientOrderByWithRelationInput[]
    cursor?: RecipeIngredientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecipeIngredientScalarFieldEnum | RecipeIngredientScalarFieldEnum[]
  }

  /**
   * MenuItem.orderItems
   */
  export type MenuItem$orderItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    where?: OrderItemWhereInput
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    cursor?: OrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * MenuItem without action
   */
  export type MenuItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuItem
     */
    select?: MenuItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MenuItem
     */
    omit?: MenuItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuItemInclude<ExtArgs> | null
  }


  /**
   * Model Supplier
   */

  export type AggregateSupplier = {
    _count: SupplierCountAggregateOutputType | null
    _avg: SupplierAvgAggregateOutputType | null
    _sum: SupplierSumAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  export type SupplierAvgAggregateOutputType = {
    rating: number | null
  }

  export type SupplierSumAggregateOutputType = {
    rating: number | null
  }

  export type SupplierMinAggregateOutputType = {
    id: string | null
    name: string | null
    contact: string | null
    email: string | null
    phone: string | null
    rating: number | null
    createdAt: Date | null
  }

  export type SupplierMaxAggregateOutputType = {
    id: string | null
    name: string | null
    contact: string | null
    email: string | null
    phone: string | null
    rating: number | null
    createdAt: Date | null
  }

  export type SupplierCountAggregateOutputType = {
    id: number
    name: number
    contact: number
    email: number
    phone: number
    rating: number
    createdAt: number
    _all: number
  }


  export type SupplierAvgAggregateInputType = {
    rating?: true
  }

  export type SupplierSumAggregateInputType = {
    rating?: true
  }

  export type SupplierMinAggregateInputType = {
    id?: true
    name?: true
    contact?: true
    email?: true
    phone?: true
    rating?: true
    createdAt?: true
  }

  export type SupplierMaxAggregateInputType = {
    id?: true
    name?: true
    contact?: true
    email?: true
    phone?: true
    rating?: true
    createdAt?: true
  }

  export type SupplierCountAggregateInputType = {
    id?: true
    name?: true
    contact?: true
    email?: true
    phone?: true
    rating?: true
    createdAt?: true
    _all?: true
  }

  export type SupplierAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Supplier to aggregate.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Suppliers
    **/
    _count?: true | SupplierCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SupplierAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SupplierSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierMaxAggregateInputType
  }

  export type GetSupplierAggregateType<T extends SupplierAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplier]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplier[P]>
      : GetScalarType<T[P], AggregateSupplier[P]>
  }




  export type SupplierGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierWhereInput
    orderBy?: SupplierOrderByWithAggregationInput | SupplierOrderByWithAggregationInput[]
    by: SupplierScalarFieldEnum[] | SupplierScalarFieldEnum
    having?: SupplierScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierCountAggregateInputType | true
    _avg?: SupplierAvgAggregateInputType
    _sum?: SupplierSumAggregateInputType
    _min?: SupplierMinAggregateInputType
    _max?: SupplierMaxAggregateInputType
  }

  export type SupplierGroupByOutputType = {
    id: string
    name: string
    contact: string | null
    email: string | null
    phone: string | null
    rating: number
    createdAt: Date
    _count: SupplierCountAggregateOutputType | null
    _avg: SupplierAvgAggregateOutputType | null
    _sum: SupplierSumAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  type GetSupplierGroupByPayload<T extends SupplierGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierGroupByOutputType[P]>
        }
      >
    >


  export type SupplierSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    contact?: boolean
    email?: boolean
    phone?: boolean
    rating?: boolean
    createdAt?: boolean
    inventoryItems?: boolean | Supplier$inventoryItemsArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    contact?: boolean
    email?: boolean
    phone?: boolean
    rating?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    contact?: boolean
    email?: boolean
    phone?: boolean
    rating?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectScalar = {
    id?: boolean
    name?: boolean
    contact?: boolean
    email?: boolean
    phone?: boolean
    rating?: boolean
    createdAt?: boolean
  }

  export type SupplierOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "contact" | "email" | "phone" | "rating" | "createdAt", ExtArgs["result"]["supplier"]>
  export type SupplierInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventoryItems?: boolean | Supplier$inventoryItemsArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SupplierIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SupplierIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SupplierPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Supplier"
    objects: {
      inventoryItems: Prisma.$InventoryItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      contact: string | null
      email: string | null
      phone: string | null
      rating: number
      createdAt: Date
    }, ExtArgs["result"]["supplier"]>
    composites: {}
  }

  type SupplierGetPayload<S extends boolean | null | undefined | SupplierDefaultArgs> = $Result.GetResult<Prisma.$SupplierPayload, S>

  type SupplierCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierCountAggregateInputType | true
    }

  export interface SupplierDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Supplier'], meta: { name: 'Supplier' } }
    /**
     * Find zero or one Supplier that matches the filter.
     * @param {SupplierFindUniqueArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierFindUniqueArgs>(args: SelectSubset<T, SupplierFindUniqueArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Supplier that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierFindUniqueOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierFindFirstArgs>(args?: SelectSubset<T, SupplierFindFirstArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Suppliers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Suppliers
     * const suppliers = await prisma.supplier.findMany()
     * 
     * // Get first 10 Suppliers
     * const suppliers = await prisma.supplier.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supplierWithIdOnly = await prisma.supplier.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupplierFindManyArgs>(args?: SelectSubset<T, SupplierFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Supplier.
     * @param {SupplierCreateArgs} args - Arguments to create a Supplier.
     * @example
     * // Create one Supplier
     * const Supplier = await prisma.supplier.create({
     *   data: {
     *     // ... data to create a Supplier
     *   }
     * })
     * 
     */
    create<T extends SupplierCreateArgs>(args: SelectSubset<T, SupplierCreateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Suppliers.
     * @param {SupplierCreateManyArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierCreateManyArgs>(args?: SelectSubset<T, SupplierCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Suppliers and returns the data saved in the database.
     * @param {SupplierCreateManyAndReturnArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Suppliers and only return the `id`
     * const supplierWithIdOnly = await prisma.supplier.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupplierCreateManyAndReturnArgs>(args?: SelectSubset<T, SupplierCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Supplier.
     * @param {SupplierDeleteArgs} args - Arguments to delete one Supplier.
     * @example
     * // Delete one Supplier
     * const Supplier = await prisma.supplier.delete({
     *   where: {
     *     // ... filter to delete one Supplier
     *   }
     * })
     * 
     */
    delete<T extends SupplierDeleteArgs>(args: SelectSubset<T, SupplierDeleteArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Supplier.
     * @param {SupplierUpdateArgs} args - Arguments to update one Supplier.
     * @example
     * // Update one Supplier
     * const supplier = await prisma.supplier.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierUpdateArgs>(args: SelectSubset<T, SupplierUpdateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Suppliers.
     * @param {SupplierDeleteManyArgs} args - Arguments to filter Suppliers to delete.
     * @example
     * // Delete a few Suppliers
     * const { count } = await prisma.supplier.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierDeleteManyArgs>(args?: SelectSubset<T, SupplierDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierUpdateManyArgs>(args: SelectSubset<T, SupplierUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers and returns the data updated in the database.
     * @param {SupplierUpdateManyAndReturnArgs} args - Arguments to update many Suppliers.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Suppliers and only return the `id`
     * const supplierWithIdOnly = await prisma.supplier.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SupplierUpdateManyAndReturnArgs>(args: SelectSubset<T, SupplierUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Supplier.
     * @param {SupplierUpsertArgs} args - Arguments to update or create a Supplier.
     * @example
     * // Update or create a Supplier
     * const supplier = await prisma.supplier.upsert({
     *   create: {
     *     // ... data to create a Supplier
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supplier we want to update
     *   }
     * })
     */
    upsert<T extends SupplierUpsertArgs>(args: SelectSubset<T, SupplierUpsertArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierCountArgs} args - Arguments to filter Suppliers to count.
     * @example
     * // Count the number of Suppliers
     * const count = await prisma.supplier.count({
     *   where: {
     *     // ... the filter for the Suppliers we want to count
     *   }
     * })
    **/
    count<T extends SupplierCountArgs>(
      args?: Subset<T, SupplierCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupplierAggregateArgs>(args: Subset<T, SupplierAggregateArgs>): Prisma.PrismaPromise<GetSupplierAggregateType<T>>

    /**
     * Group by Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupplierGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierGroupByArgs['orderBy'] }
        : { orderBy?: SupplierGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupplierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Supplier model
   */
  readonly fields: SupplierFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Supplier.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inventoryItems<T extends Supplier$inventoryItemsArgs<ExtArgs> = {}>(args?: Subset<T, Supplier$inventoryItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Supplier model
   */
  interface SupplierFieldRefs {
    readonly id: FieldRef<"Supplier", 'String'>
    readonly name: FieldRef<"Supplier", 'String'>
    readonly contact: FieldRef<"Supplier", 'String'>
    readonly email: FieldRef<"Supplier", 'String'>
    readonly phone: FieldRef<"Supplier", 'String'>
    readonly rating: FieldRef<"Supplier", 'Float'>
    readonly createdAt: FieldRef<"Supplier", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Supplier findUnique
   */
  export type SupplierFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findUniqueOrThrow
   */
  export type SupplierFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findFirst
   */
  export type SupplierFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findFirstOrThrow
   */
  export type SupplierFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findMany
   */
  export type SupplierFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Suppliers to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier create
   */
  export type SupplierCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to create a Supplier.
     */
    data: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
  }

  /**
   * Supplier createMany
   */
  export type SupplierCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Supplier createManyAndReturn
   */
  export type SupplierCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Supplier update
   */
  export type SupplierUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to update a Supplier.
     */
    data: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
    /**
     * Choose, which Supplier to update.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier updateMany
   */
  export type SupplierUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier updateManyAndReturn
   */
  export type SupplierUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier upsert
   */
  export type SupplierUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The filter to search for the Supplier to update in case it exists.
     */
    where: SupplierWhereUniqueInput
    /**
     * In case the Supplier found by the `where` argument doesn't exist, create a new Supplier with this data.
     */
    create: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
    /**
     * In case the Supplier was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
  }

  /**
   * Supplier delete
   */
  export type SupplierDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter which Supplier to delete.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier deleteMany
   */
  export type SupplierDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Suppliers to delete
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to delete.
     */
    limit?: number
  }

  /**
   * Supplier.inventoryItems
   */
  export type Supplier$inventoryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    where?: InventoryItemWhereInput
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    cursor?: InventoryItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * Supplier without action
   */
  export type SupplierDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
  }


  /**
   * Model InventoryItem
   */

  export type AggregateInventoryItem = {
    _count: InventoryItemCountAggregateOutputType | null
    _avg: InventoryItemAvgAggregateOutputType | null
    _sum: InventoryItemSumAggregateOutputType | null
    _min: InventoryItemMinAggregateOutputType | null
    _max: InventoryItemMaxAggregateOutputType | null
  }

  export type InventoryItemAvgAggregateOutputType = {
    stock: Decimal | null
    reorderLevel: Decimal | null
    costPerUnit: Decimal | null
  }

  export type InventoryItemSumAggregateOutputType = {
    stock: Decimal | null
    reorderLevel: Decimal | null
    costPerUnit: Decimal | null
  }

  export type InventoryItemMinAggregateOutputType = {
    id: string | null
    name: string | null
    sku: string | null
    category: string | null
    unit: string | null
    stock: Decimal | null
    reorderLevel: Decimal | null
    costPerUnit: Decimal | null
    supplierId: string | null
    lastRestocked: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryItemMaxAggregateOutputType = {
    id: string | null
    name: string | null
    sku: string | null
    category: string | null
    unit: string | null
    stock: Decimal | null
    reorderLevel: Decimal | null
    costPerUnit: Decimal | null
    supplierId: string | null
    lastRestocked: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryItemCountAggregateOutputType = {
    id: number
    name: number
    sku: number
    category: number
    unit: number
    stock: number
    reorderLevel: number
    costPerUnit: number
    supplierId: number
    lastRestocked: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InventoryItemAvgAggregateInputType = {
    stock?: true
    reorderLevel?: true
    costPerUnit?: true
  }

  export type InventoryItemSumAggregateInputType = {
    stock?: true
    reorderLevel?: true
    costPerUnit?: true
  }

  export type InventoryItemMinAggregateInputType = {
    id?: true
    name?: true
    sku?: true
    category?: true
    unit?: true
    stock?: true
    reorderLevel?: true
    costPerUnit?: true
    supplierId?: true
    lastRestocked?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryItemMaxAggregateInputType = {
    id?: true
    name?: true
    sku?: true
    category?: true
    unit?: true
    stock?: true
    reorderLevel?: true
    costPerUnit?: true
    supplierId?: true
    lastRestocked?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryItemCountAggregateInputType = {
    id?: true
    name?: true
    sku?: true
    category?: true
    unit?: true
    stock?: true
    reorderLevel?: true
    costPerUnit?: true
    supplierId?: true
    lastRestocked?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InventoryItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryItem to aggregate.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryItems
    **/
    _count?: true | InventoryItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryItemMaxAggregateInputType
  }

  export type GetInventoryItemAggregateType<T extends InventoryItemAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryItem[P]>
      : GetScalarType<T[P], AggregateInventoryItem[P]>
  }




  export type InventoryItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryItemWhereInput
    orderBy?: InventoryItemOrderByWithAggregationInput | InventoryItemOrderByWithAggregationInput[]
    by: InventoryItemScalarFieldEnum[] | InventoryItemScalarFieldEnum
    having?: InventoryItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryItemCountAggregateInputType | true
    _avg?: InventoryItemAvgAggregateInputType
    _sum?: InventoryItemSumAggregateInputType
    _min?: InventoryItemMinAggregateInputType
    _max?: InventoryItemMaxAggregateInputType
  }

  export type InventoryItemGroupByOutputType = {
    id: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal
    reorderLevel: Decimal
    costPerUnit: Decimal
    supplierId: string | null
    lastRestocked: Date | null
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: InventoryItemCountAggregateOutputType | null
    _avg: InventoryItemAvgAggregateOutputType | null
    _sum: InventoryItemSumAggregateOutputType | null
    _min: InventoryItemMinAggregateOutputType | null
    _max: InventoryItemMaxAggregateOutputType | null
  }

  type GetInventoryItemGroupByPayload<T extends InventoryItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryItemGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryItemGroupByOutputType[P]>
        }
      >
    >


  export type InventoryItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sku?: boolean
    category?: boolean
    unit?: boolean
    stock?: boolean
    reorderLevel?: boolean
    costPerUnit?: boolean
    supplierId?: boolean
    lastRestocked?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | InventoryItem$supplierArgs<ExtArgs>
    recipes?: boolean | InventoryItem$recipesArgs<ExtArgs>
    movements?: boolean | InventoryItem$movementsArgs<ExtArgs>
    _count?: boolean | InventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryItem"]>

  export type InventoryItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sku?: boolean
    category?: boolean
    unit?: boolean
    stock?: boolean
    reorderLevel?: boolean
    costPerUnit?: boolean
    supplierId?: boolean
    lastRestocked?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | InventoryItem$supplierArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryItem"]>

  export type InventoryItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sku?: boolean
    category?: boolean
    unit?: boolean
    stock?: boolean
    reorderLevel?: boolean
    costPerUnit?: boolean
    supplierId?: boolean
    lastRestocked?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | InventoryItem$supplierArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryItem"]>

  export type InventoryItemSelectScalar = {
    id?: boolean
    name?: boolean
    sku?: boolean
    category?: boolean
    unit?: boolean
    stock?: boolean
    reorderLevel?: boolean
    costPerUnit?: boolean
    supplierId?: boolean
    lastRestocked?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InventoryItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "sku" | "category" | "unit" | "stock" | "reorderLevel" | "costPerUnit" | "supplierId" | "lastRestocked" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["inventoryItem"]>
  export type InventoryItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | InventoryItem$supplierArgs<ExtArgs>
    recipes?: boolean | InventoryItem$recipesArgs<ExtArgs>
    movements?: boolean | InventoryItem$movementsArgs<ExtArgs>
    _count?: boolean | InventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InventoryItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | InventoryItem$supplierArgs<ExtArgs>
  }
  export type InventoryItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | InventoryItem$supplierArgs<ExtArgs>
  }

  export type $InventoryItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryItem"
    objects: {
      supplier: Prisma.$SupplierPayload<ExtArgs> | null
      recipes: Prisma.$RecipeIngredientPayload<ExtArgs>[]
      movements: Prisma.$InventoryMovementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      sku: string
      category: string
      unit: string
      stock: Prisma.Decimal
      reorderLevel: Prisma.Decimal
      costPerUnit: Prisma.Decimal
      supplierId: string | null
      lastRestocked: Date | null
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventoryItem"]>
    composites: {}
  }

  type InventoryItemGetPayload<S extends boolean | null | undefined | InventoryItemDefaultArgs> = $Result.GetResult<Prisma.$InventoryItemPayload, S>

  type InventoryItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryItemCountAggregateInputType | true
    }

  export interface InventoryItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryItem'], meta: { name: 'InventoryItem' } }
    /**
     * Find zero or one InventoryItem that matches the filter.
     * @param {InventoryItemFindUniqueArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryItemFindUniqueArgs>(args: SelectSubset<T, InventoryItemFindUniqueArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryItemFindUniqueOrThrowArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryItemFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindFirstArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryItemFindFirstArgs>(args?: SelectSubset<T, InventoryItemFindFirstArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindFirstOrThrowArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryItemFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryItems
     * const inventoryItems = await prisma.inventoryItem.findMany()
     * 
     * // Get first 10 InventoryItems
     * const inventoryItems = await prisma.inventoryItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryItemWithIdOnly = await prisma.inventoryItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryItemFindManyArgs>(args?: SelectSubset<T, InventoryItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryItem.
     * @param {InventoryItemCreateArgs} args - Arguments to create a InventoryItem.
     * @example
     * // Create one InventoryItem
     * const InventoryItem = await prisma.inventoryItem.create({
     *   data: {
     *     // ... data to create a InventoryItem
     *   }
     * })
     * 
     */
    create<T extends InventoryItemCreateArgs>(args: SelectSubset<T, InventoryItemCreateArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryItems.
     * @param {InventoryItemCreateManyArgs} args - Arguments to create many InventoryItems.
     * @example
     * // Create many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryItemCreateManyArgs>(args?: SelectSubset<T, InventoryItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryItems and returns the data saved in the database.
     * @param {InventoryItemCreateManyAndReturnArgs} args - Arguments to create many InventoryItems.
     * @example
     * // Create many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryItems and only return the `id`
     * const inventoryItemWithIdOnly = await prisma.inventoryItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryItemCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InventoryItem.
     * @param {InventoryItemDeleteArgs} args - Arguments to delete one InventoryItem.
     * @example
     * // Delete one InventoryItem
     * const InventoryItem = await prisma.inventoryItem.delete({
     *   where: {
     *     // ... filter to delete one InventoryItem
     *   }
     * })
     * 
     */
    delete<T extends InventoryItemDeleteArgs>(args: SelectSubset<T, InventoryItemDeleteArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryItem.
     * @param {InventoryItemUpdateArgs} args - Arguments to update one InventoryItem.
     * @example
     * // Update one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryItemUpdateArgs>(args: SelectSubset<T, InventoryItemUpdateArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryItems.
     * @param {InventoryItemDeleteManyArgs} args - Arguments to filter InventoryItems to delete.
     * @example
     * // Delete a few InventoryItems
     * const { count } = await prisma.inventoryItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryItemDeleteManyArgs>(args?: SelectSubset<T, InventoryItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryItemUpdateManyArgs>(args: SelectSubset<T, InventoryItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryItems and returns the data updated in the database.
     * @param {InventoryItemUpdateManyAndReturnArgs} args - Arguments to update many InventoryItems.
     * @example
     * // Update many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InventoryItems and only return the `id`
     * const inventoryItemWithIdOnly = await prisma.inventoryItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InventoryItemUpdateManyAndReturnArgs>(args: SelectSubset<T, InventoryItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InventoryItem.
     * @param {InventoryItemUpsertArgs} args - Arguments to update or create a InventoryItem.
     * @example
     * // Update or create a InventoryItem
     * const inventoryItem = await prisma.inventoryItem.upsert({
     *   create: {
     *     // ... data to create a InventoryItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryItem we want to update
     *   }
     * })
     */
    upsert<T extends InventoryItemUpsertArgs>(args: SelectSubset<T, InventoryItemUpsertArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemCountArgs} args - Arguments to filter InventoryItems to count.
     * @example
     * // Count the number of InventoryItems
     * const count = await prisma.inventoryItem.count({
     *   where: {
     *     // ... the filter for the InventoryItems we want to count
     *   }
     * })
    **/
    count<T extends InventoryItemCountArgs>(
      args?: Subset<T, InventoryItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryItemAggregateArgs>(args: Subset<T, InventoryItemAggregateArgs>): Prisma.PrismaPromise<GetInventoryItemAggregateType<T>>

    /**
     * Group by InventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryItemGroupByArgs['orderBy'] }
        : { orderBy?: InventoryItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryItem model
   */
  readonly fields: InventoryItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    supplier<T extends InventoryItem$supplierArgs<ExtArgs> = {}>(args?: Subset<T, InventoryItem$supplierArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    recipes<T extends InventoryItem$recipesArgs<ExtArgs> = {}>(args?: Subset<T, InventoryItem$recipesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    movements<T extends InventoryItem$movementsArgs<ExtArgs> = {}>(args?: Subset<T, InventoryItem$movementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InventoryItem model
   */
  interface InventoryItemFieldRefs {
    readonly id: FieldRef<"InventoryItem", 'String'>
    readonly name: FieldRef<"InventoryItem", 'String'>
    readonly sku: FieldRef<"InventoryItem", 'String'>
    readonly category: FieldRef<"InventoryItem", 'String'>
    readonly unit: FieldRef<"InventoryItem", 'String'>
    readonly stock: FieldRef<"InventoryItem", 'Decimal'>
    readonly reorderLevel: FieldRef<"InventoryItem", 'Decimal'>
    readonly costPerUnit: FieldRef<"InventoryItem", 'Decimal'>
    readonly supplierId: FieldRef<"InventoryItem", 'String'>
    readonly lastRestocked: FieldRef<"InventoryItem", 'DateTime'>
    readonly expiresAt: FieldRef<"InventoryItem", 'DateTime'>
    readonly createdAt: FieldRef<"InventoryItem", 'DateTime'>
    readonly updatedAt: FieldRef<"InventoryItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryItem findUnique
   */
  export type InventoryItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem findUniqueOrThrow
   */
  export type InventoryItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem findFirst
   */
  export type InventoryItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryItems.
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryItem findFirstOrThrow
   */
  export type InventoryItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryItems.
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryItem findMany
   */
  export type InventoryItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItems to fetch.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryItems.
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryItem create
   */
  export type InventoryItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryItem.
     */
    data: XOR<InventoryItemCreateInput, InventoryItemUncheckedCreateInput>
  }

  /**
   * InventoryItem createMany
   */
  export type InventoryItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryItems.
     */
    data: InventoryItemCreateManyInput | InventoryItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryItem createManyAndReturn
   */
  export type InventoryItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * The data used to create many InventoryItems.
     */
    data: InventoryItemCreateManyInput | InventoryItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryItem update
   */
  export type InventoryItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryItem.
     */
    data: XOR<InventoryItemUpdateInput, InventoryItemUncheckedUpdateInput>
    /**
     * Choose, which InventoryItem to update.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem updateMany
   */
  export type InventoryItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryItems.
     */
    data: XOR<InventoryItemUpdateManyMutationInput, InventoryItemUncheckedUpdateManyInput>
    /**
     * Filter which InventoryItems to update
     */
    where?: InventoryItemWhereInput
    /**
     * Limit how many InventoryItems to update.
     */
    limit?: number
  }

  /**
   * InventoryItem updateManyAndReturn
   */
  export type InventoryItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * The data used to update InventoryItems.
     */
    data: XOR<InventoryItemUpdateManyMutationInput, InventoryItemUncheckedUpdateManyInput>
    /**
     * Filter which InventoryItems to update
     */
    where?: InventoryItemWhereInput
    /**
     * Limit how many InventoryItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryItem upsert
   */
  export type InventoryItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryItem to update in case it exists.
     */
    where: InventoryItemWhereUniqueInput
    /**
     * In case the InventoryItem found by the `where` argument doesn't exist, create a new InventoryItem with this data.
     */
    create: XOR<InventoryItemCreateInput, InventoryItemUncheckedCreateInput>
    /**
     * In case the InventoryItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryItemUpdateInput, InventoryItemUncheckedUpdateInput>
  }

  /**
   * InventoryItem delete
   */
  export type InventoryItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter which InventoryItem to delete.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem deleteMany
   */
  export type InventoryItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryItems to delete
     */
    where?: InventoryItemWhereInput
    /**
     * Limit how many InventoryItems to delete.
     */
    limit?: number
  }

  /**
   * InventoryItem.supplier
   */
  export type InventoryItem$supplierArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    where?: SupplierWhereInput
  }

  /**
   * InventoryItem.recipes
   */
  export type InventoryItem$recipesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    where?: RecipeIngredientWhereInput
    orderBy?: RecipeIngredientOrderByWithRelationInput | RecipeIngredientOrderByWithRelationInput[]
    cursor?: RecipeIngredientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecipeIngredientScalarFieldEnum | RecipeIngredientScalarFieldEnum[]
  }

  /**
   * InventoryItem.movements
   */
  export type InventoryItem$movementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    where?: InventoryMovementWhereInput
    orderBy?: InventoryMovementOrderByWithRelationInput | InventoryMovementOrderByWithRelationInput[]
    cursor?: InventoryMovementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryMovementScalarFieldEnum | InventoryMovementScalarFieldEnum[]
  }

  /**
   * InventoryItem without action
   */
  export type InventoryItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
  }


  /**
   * Model RecipeIngredient
   */

  export type AggregateRecipeIngredient = {
    _count: RecipeIngredientCountAggregateOutputType | null
    _avg: RecipeIngredientAvgAggregateOutputType | null
    _sum: RecipeIngredientSumAggregateOutputType | null
    _min: RecipeIngredientMinAggregateOutputType | null
    _max: RecipeIngredientMaxAggregateOutputType | null
  }

  export type RecipeIngredientAvgAggregateOutputType = {
    quantity: Decimal | null
  }

  export type RecipeIngredientSumAggregateOutputType = {
    quantity: Decimal | null
  }

  export type RecipeIngredientMinAggregateOutputType = {
    id: string | null
    menuItemId: string | null
    inventoryItemId: string | null
    quantity: Decimal | null
    unit: string | null
  }

  export type RecipeIngredientMaxAggregateOutputType = {
    id: string | null
    menuItemId: string | null
    inventoryItemId: string | null
    quantity: Decimal | null
    unit: string | null
  }

  export type RecipeIngredientCountAggregateOutputType = {
    id: number
    menuItemId: number
    inventoryItemId: number
    quantity: number
    unit: number
    _all: number
  }


  export type RecipeIngredientAvgAggregateInputType = {
    quantity?: true
  }

  export type RecipeIngredientSumAggregateInputType = {
    quantity?: true
  }

  export type RecipeIngredientMinAggregateInputType = {
    id?: true
    menuItemId?: true
    inventoryItemId?: true
    quantity?: true
    unit?: true
  }

  export type RecipeIngredientMaxAggregateInputType = {
    id?: true
    menuItemId?: true
    inventoryItemId?: true
    quantity?: true
    unit?: true
  }

  export type RecipeIngredientCountAggregateInputType = {
    id?: true
    menuItemId?: true
    inventoryItemId?: true
    quantity?: true
    unit?: true
    _all?: true
  }

  export type RecipeIngredientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecipeIngredient to aggregate.
     */
    where?: RecipeIngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecipeIngredients to fetch.
     */
    orderBy?: RecipeIngredientOrderByWithRelationInput | RecipeIngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecipeIngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecipeIngredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecipeIngredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RecipeIngredients
    **/
    _count?: true | RecipeIngredientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecipeIngredientAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecipeIngredientSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecipeIngredientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecipeIngredientMaxAggregateInputType
  }

  export type GetRecipeIngredientAggregateType<T extends RecipeIngredientAggregateArgs> = {
        [P in keyof T & keyof AggregateRecipeIngredient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecipeIngredient[P]>
      : GetScalarType<T[P], AggregateRecipeIngredient[P]>
  }




  export type RecipeIngredientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecipeIngredientWhereInput
    orderBy?: RecipeIngredientOrderByWithAggregationInput | RecipeIngredientOrderByWithAggregationInput[]
    by: RecipeIngredientScalarFieldEnum[] | RecipeIngredientScalarFieldEnum
    having?: RecipeIngredientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecipeIngredientCountAggregateInputType | true
    _avg?: RecipeIngredientAvgAggregateInputType
    _sum?: RecipeIngredientSumAggregateInputType
    _min?: RecipeIngredientMinAggregateInputType
    _max?: RecipeIngredientMaxAggregateInputType
  }

  export type RecipeIngredientGroupByOutputType = {
    id: string
    menuItemId: string
    inventoryItemId: string
    quantity: Decimal
    unit: string
    _count: RecipeIngredientCountAggregateOutputType | null
    _avg: RecipeIngredientAvgAggregateOutputType | null
    _sum: RecipeIngredientSumAggregateOutputType | null
    _min: RecipeIngredientMinAggregateOutputType | null
    _max: RecipeIngredientMaxAggregateOutputType | null
  }

  type GetRecipeIngredientGroupByPayload<T extends RecipeIngredientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecipeIngredientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecipeIngredientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecipeIngredientGroupByOutputType[P]>
            : GetScalarType<T[P], RecipeIngredientGroupByOutputType[P]>
        }
      >
    >


  export type RecipeIngredientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    menuItemId?: boolean
    inventoryItemId?: boolean
    quantity?: boolean
    unit?: boolean
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recipeIngredient"]>

  export type RecipeIngredientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    menuItemId?: boolean
    inventoryItemId?: boolean
    quantity?: boolean
    unit?: boolean
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recipeIngredient"]>

  export type RecipeIngredientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    menuItemId?: boolean
    inventoryItemId?: boolean
    quantity?: boolean
    unit?: boolean
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recipeIngredient"]>

  export type RecipeIngredientSelectScalar = {
    id?: boolean
    menuItemId?: boolean
    inventoryItemId?: boolean
    quantity?: boolean
    unit?: boolean
  }

  export type RecipeIngredientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "menuItemId" | "inventoryItemId" | "quantity" | "unit", ExtArgs["result"]["recipeIngredient"]>
  export type RecipeIngredientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }
  export type RecipeIngredientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }
  export type RecipeIngredientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }

  export type $RecipeIngredientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RecipeIngredient"
    objects: {
      menuItem: Prisma.$MenuItemPayload<ExtArgs>
      inventoryItem: Prisma.$InventoryItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      menuItemId: string
      inventoryItemId: string
      quantity: Prisma.Decimal
      unit: string
    }, ExtArgs["result"]["recipeIngredient"]>
    composites: {}
  }

  type RecipeIngredientGetPayload<S extends boolean | null | undefined | RecipeIngredientDefaultArgs> = $Result.GetResult<Prisma.$RecipeIngredientPayload, S>

  type RecipeIngredientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecipeIngredientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecipeIngredientCountAggregateInputType | true
    }

  export interface RecipeIngredientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RecipeIngredient'], meta: { name: 'RecipeIngredient' } }
    /**
     * Find zero or one RecipeIngredient that matches the filter.
     * @param {RecipeIngredientFindUniqueArgs} args - Arguments to find a RecipeIngredient
     * @example
     * // Get one RecipeIngredient
     * const recipeIngredient = await prisma.recipeIngredient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecipeIngredientFindUniqueArgs>(args: SelectSubset<T, RecipeIngredientFindUniqueArgs<ExtArgs>>): Prisma__RecipeIngredientClient<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RecipeIngredient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecipeIngredientFindUniqueOrThrowArgs} args - Arguments to find a RecipeIngredient
     * @example
     * // Get one RecipeIngredient
     * const recipeIngredient = await prisma.recipeIngredient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecipeIngredientFindUniqueOrThrowArgs>(args: SelectSubset<T, RecipeIngredientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecipeIngredientClient<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecipeIngredient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeIngredientFindFirstArgs} args - Arguments to find a RecipeIngredient
     * @example
     * // Get one RecipeIngredient
     * const recipeIngredient = await prisma.recipeIngredient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecipeIngredientFindFirstArgs>(args?: SelectSubset<T, RecipeIngredientFindFirstArgs<ExtArgs>>): Prisma__RecipeIngredientClient<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecipeIngredient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeIngredientFindFirstOrThrowArgs} args - Arguments to find a RecipeIngredient
     * @example
     * // Get one RecipeIngredient
     * const recipeIngredient = await prisma.recipeIngredient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecipeIngredientFindFirstOrThrowArgs>(args?: SelectSubset<T, RecipeIngredientFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecipeIngredientClient<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RecipeIngredients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeIngredientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RecipeIngredients
     * const recipeIngredients = await prisma.recipeIngredient.findMany()
     * 
     * // Get first 10 RecipeIngredients
     * const recipeIngredients = await prisma.recipeIngredient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recipeIngredientWithIdOnly = await prisma.recipeIngredient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecipeIngredientFindManyArgs>(args?: SelectSubset<T, RecipeIngredientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RecipeIngredient.
     * @param {RecipeIngredientCreateArgs} args - Arguments to create a RecipeIngredient.
     * @example
     * // Create one RecipeIngredient
     * const RecipeIngredient = await prisma.recipeIngredient.create({
     *   data: {
     *     // ... data to create a RecipeIngredient
     *   }
     * })
     * 
     */
    create<T extends RecipeIngredientCreateArgs>(args: SelectSubset<T, RecipeIngredientCreateArgs<ExtArgs>>): Prisma__RecipeIngredientClient<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RecipeIngredients.
     * @param {RecipeIngredientCreateManyArgs} args - Arguments to create many RecipeIngredients.
     * @example
     * // Create many RecipeIngredients
     * const recipeIngredient = await prisma.recipeIngredient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecipeIngredientCreateManyArgs>(args?: SelectSubset<T, RecipeIngredientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RecipeIngredients and returns the data saved in the database.
     * @param {RecipeIngredientCreateManyAndReturnArgs} args - Arguments to create many RecipeIngredients.
     * @example
     * // Create many RecipeIngredients
     * const recipeIngredient = await prisma.recipeIngredient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RecipeIngredients and only return the `id`
     * const recipeIngredientWithIdOnly = await prisma.recipeIngredient.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecipeIngredientCreateManyAndReturnArgs>(args?: SelectSubset<T, RecipeIngredientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RecipeIngredient.
     * @param {RecipeIngredientDeleteArgs} args - Arguments to delete one RecipeIngredient.
     * @example
     * // Delete one RecipeIngredient
     * const RecipeIngredient = await prisma.recipeIngredient.delete({
     *   where: {
     *     // ... filter to delete one RecipeIngredient
     *   }
     * })
     * 
     */
    delete<T extends RecipeIngredientDeleteArgs>(args: SelectSubset<T, RecipeIngredientDeleteArgs<ExtArgs>>): Prisma__RecipeIngredientClient<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RecipeIngredient.
     * @param {RecipeIngredientUpdateArgs} args - Arguments to update one RecipeIngredient.
     * @example
     * // Update one RecipeIngredient
     * const recipeIngredient = await prisma.recipeIngredient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecipeIngredientUpdateArgs>(args: SelectSubset<T, RecipeIngredientUpdateArgs<ExtArgs>>): Prisma__RecipeIngredientClient<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RecipeIngredients.
     * @param {RecipeIngredientDeleteManyArgs} args - Arguments to filter RecipeIngredients to delete.
     * @example
     * // Delete a few RecipeIngredients
     * const { count } = await prisma.recipeIngredient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecipeIngredientDeleteManyArgs>(args?: SelectSubset<T, RecipeIngredientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecipeIngredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeIngredientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RecipeIngredients
     * const recipeIngredient = await prisma.recipeIngredient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecipeIngredientUpdateManyArgs>(args: SelectSubset<T, RecipeIngredientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecipeIngredients and returns the data updated in the database.
     * @param {RecipeIngredientUpdateManyAndReturnArgs} args - Arguments to update many RecipeIngredients.
     * @example
     * // Update many RecipeIngredients
     * const recipeIngredient = await prisma.recipeIngredient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RecipeIngredients and only return the `id`
     * const recipeIngredientWithIdOnly = await prisma.recipeIngredient.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RecipeIngredientUpdateManyAndReturnArgs>(args: SelectSubset<T, RecipeIngredientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RecipeIngredient.
     * @param {RecipeIngredientUpsertArgs} args - Arguments to update or create a RecipeIngredient.
     * @example
     * // Update or create a RecipeIngredient
     * const recipeIngredient = await prisma.recipeIngredient.upsert({
     *   create: {
     *     // ... data to create a RecipeIngredient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RecipeIngredient we want to update
     *   }
     * })
     */
    upsert<T extends RecipeIngredientUpsertArgs>(args: SelectSubset<T, RecipeIngredientUpsertArgs<ExtArgs>>): Prisma__RecipeIngredientClient<$Result.GetResult<Prisma.$RecipeIngredientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RecipeIngredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeIngredientCountArgs} args - Arguments to filter RecipeIngredients to count.
     * @example
     * // Count the number of RecipeIngredients
     * const count = await prisma.recipeIngredient.count({
     *   where: {
     *     // ... the filter for the RecipeIngredients we want to count
     *   }
     * })
    **/
    count<T extends RecipeIngredientCountArgs>(
      args?: Subset<T, RecipeIngredientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecipeIngredientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RecipeIngredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeIngredientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecipeIngredientAggregateArgs>(args: Subset<T, RecipeIngredientAggregateArgs>): Prisma.PrismaPromise<GetRecipeIngredientAggregateType<T>>

    /**
     * Group by RecipeIngredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeIngredientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecipeIngredientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecipeIngredientGroupByArgs['orderBy'] }
        : { orderBy?: RecipeIngredientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecipeIngredientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecipeIngredientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RecipeIngredient model
   */
  readonly fields: RecipeIngredientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RecipeIngredient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecipeIngredientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    menuItem<T extends MenuItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MenuItemDefaultArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    inventoryItem<T extends InventoryItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryItemDefaultArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RecipeIngredient model
   */
  interface RecipeIngredientFieldRefs {
    readonly id: FieldRef<"RecipeIngredient", 'String'>
    readonly menuItemId: FieldRef<"RecipeIngredient", 'String'>
    readonly inventoryItemId: FieldRef<"RecipeIngredient", 'String'>
    readonly quantity: FieldRef<"RecipeIngredient", 'Decimal'>
    readonly unit: FieldRef<"RecipeIngredient", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RecipeIngredient findUnique
   */
  export type RecipeIngredientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    /**
     * Filter, which RecipeIngredient to fetch.
     */
    where: RecipeIngredientWhereUniqueInput
  }

  /**
   * RecipeIngredient findUniqueOrThrow
   */
  export type RecipeIngredientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    /**
     * Filter, which RecipeIngredient to fetch.
     */
    where: RecipeIngredientWhereUniqueInput
  }

  /**
   * RecipeIngredient findFirst
   */
  export type RecipeIngredientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    /**
     * Filter, which RecipeIngredient to fetch.
     */
    where?: RecipeIngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecipeIngredients to fetch.
     */
    orderBy?: RecipeIngredientOrderByWithRelationInput | RecipeIngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecipeIngredients.
     */
    cursor?: RecipeIngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecipeIngredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecipeIngredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecipeIngredients.
     */
    distinct?: RecipeIngredientScalarFieldEnum | RecipeIngredientScalarFieldEnum[]
  }

  /**
   * RecipeIngredient findFirstOrThrow
   */
  export type RecipeIngredientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    /**
     * Filter, which RecipeIngredient to fetch.
     */
    where?: RecipeIngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecipeIngredients to fetch.
     */
    orderBy?: RecipeIngredientOrderByWithRelationInput | RecipeIngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecipeIngredients.
     */
    cursor?: RecipeIngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecipeIngredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecipeIngredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecipeIngredients.
     */
    distinct?: RecipeIngredientScalarFieldEnum | RecipeIngredientScalarFieldEnum[]
  }

  /**
   * RecipeIngredient findMany
   */
  export type RecipeIngredientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    /**
     * Filter, which RecipeIngredients to fetch.
     */
    where?: RecipeIngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecipeIngredients to fetch.
     */
    orderBy?: RecipeIngredientOrderByWithRelationInput | RecipeIngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RecipeIngredients.
     */
    cursor?: RecipeIngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecipeIngredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecipeIngredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecipeIngredients.
     */
    distinct?: RecipeIngredientScalarFieldEnum | RecipeIngredientScalarFieldEnum[]
  }

  /**
   * RecipeIngredient create
   */
  export type RecipeIngredientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    /**
     * The data needed to create a RecipeIngredient.
     */
    data: XOR<RecipeIngredientCreateInput, RecipeIngredientUncheckedCreateInput>
  }

  /**
   * RecipeIngredient createMany
   */
  export type RecipeIngredientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RecipeIngredients.
     */
    data: RecipeIngredientCreateManyInput | RecipeIngredientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RecipeIngredient createManyAndReturn
   */
  export type RecipeIngredientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * The data used to create many RecipeIngredients.
     */
    data: RecipeIngredientCreateManyInput | RecipeIngredientCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RecipeIngredient update
   */
  export type RecipeIngredientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    /**
     * The data needed to update a RecipeIngredient.
     */
    data: XOR<RecipeIngredientUpdateInput, RecipeIngredientUncheckedUpdateInput>
    /**
     * Choose, which RecipeIngredient to update.
     */
    where: RecipeIngredientWhereUniqueInput
  }

  /**
   * RecipeIngredient updateMany
   */
  export type RecipeIngredientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RecipeIngredients.
     */
    data: XOR<RecipeIngredientUpdateManyMutationInput, RecipeIngredientUncheckedUpdateManyInput>
    /**
     * Filter which RecipeIngredients to update
     */
    where?: RecipeIngredientWhereInput
    /**
     * Limit how many RecipeIngredients to update.
     */
    limit?: number
  }

  /**
   * RecipeIngredient updateManyAndReturn
   */
  export type RecipeIngredientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * The data used to update RecipeIngredients.
     */
    data: XOR<RecipeIngredientUpdateManyMutationInput, RecipeIngredientUncheckedUpdateManyInput>
    /**
     * Filter which RecipeIngredients to update
     */
    where?: RecipeIngredientWhereInput
    /**
     * Limit how many RecipeIngredients to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RecipeIngredient upsert
   */
  export type RecipeIngredientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    /**
     * The filter to search for the RecipeIngredient to update in case it exists.
     */
    where: RecipeIngredientWhereUniqueInput
    /**
     * In case the RecipeIngredient found by the `where` argument doesn't exist, create a new RecipeIngredient with this data.
     */
    create: XOR<RecipeIngredientCreateInput, RecipeIngredientUncheckedCreateInput>
    /**
     * In case the RecipeIngredient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecipeIngredientUpdateInput, RecipeIngredientUncheckedUpdateInput>
  }

  /**
   * RecipeIngredient delete
   */
  export type RecipeIngredientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
    /**
     * Filter which RecipeIngredient to delete.
     */
    where: RecipeIngredientWhereUniqueInput
  }

  /**
   * RecipeIngredient deleteMany
   */
  export type RecipeIngredientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecipeIngredients to delete
     */
    where?: RecipeIngredientWhereInput
    /**
     * Limit how many RecipeIngredients to delete.
     */
    limit?: number
  }

  /**
   * RecipeIngredient without action
   */
  export type RecipeIngredientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeIngredient
     */
    select?: RecipeIngredientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecipeIngredient
     */
    omit?: RecipeIngredientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIngredientInclude<ExtArgs> | null
  }


  /**
   * Model InventoryMovement
   */

  export type AggregateInventoryMovement = {
    _count: InventoryMovementCountAggregateOutputType | null
    _avg: InventoryMovementAvgAggregateOutputType | null
    _sum: InventoryMovementSumAggregateOutputType | null
    _min: InventoryMovementMinAggregateOutputType | null
    _max: InventoryMovementMaxAggregateOutputType | null
  }

  export type InventoryMovementAvgAggregateOutputType = {
    delta: Decimal | null
  }

  export type InventoryMovementSumAggregateOutputType = {
    delta: Decimal | null
  }

  export type InventoryMovementMinAggregateOutputType = {
    id: string | null
    inventoryItemId: string | null
    delta: Decimal | null
    reason: string | null
    orderId: string | null
    createdAt: Date | null
  }

  export type InventoryMovementMaxAggregateOutputType = {
    id: string | null
    inventoryItemId: string | null
    delta: Decimal | null
    reason: string | null
    orderId: string | null
    createdAt: Date | null
  }

  export type InventoryMovementCountAggregateOutputType = {
    id: number
    inventoryItemId: number
    delta: number
    reason: number
    orderId: number
    createdAt: number
    _all: number
  }


  export type InventoryMovementAvgAggregateInputType = {
    delta?: true
  }

  export type InventoryMovementSumAggregateInputType = {
    delta?: true
  }

  export type InventoryMovementMinAggregateInputType = {
    id?: true
    inventoryItemId?: true
    delta?: true
    reason?: true
    orderId?: true
    createdAt?: true
  }

  export type InventoryMovementMaxAggregateInputType = {
    id?: true
    inventoryItemId?: true
    delta?: true
    reason?: true
    orderId?: true
    createdAt?: true
  }

  export type InventoryMovementCountAggregateInputType = {
    id?: true
    inventoryItemId?: true
    delta?: true
    reason?: true
    orderId?: true
    createdAt?: true
    _all?: true
  }

  export type InventoryMovementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryMovement to aggregate.
     */
    where?: InventoryMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryMovements to fetch.
     */
    orderBy?: InventoryMovementOrderByWithRelationInput | InventoryMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryMovements
    **/
    _count?: true | InventoryMovementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryMovementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryMovementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryMovementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryMovementMaxAggregateInputType
  }

  export type GetInventoryMovementAggregateType<T extends InventoryMovementAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryMovement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryMovement[P]>
      : GetScalarType<T[P], AggregateInventoryMovement[P]>
  }




  export type InventoryMovementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryMovementWhereInput
    orderBy?: InventoryMovementOrderByWithAggregationInput | InventoryMovementOrderByWithAggregationInput[]
    by: InventoryMovementScalarFieldEnum[] | InventoryMovementScalarFieldEnum
    having?: InventoryMovementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryMovementCountAggregateInputType | true
    _avg?: InventoryMovementAvgAggregateInputType
    _sum?: InventoryMovementSumAggregateInputType
    _min?: InventoryMovementMinAggregateInputType
    _max?: InventoryMovementMaxAggregateInputType
  }

  export type InventoryMovementGroupByOutputType = {
    id: string
    inventoryItemId: string
    delta: Decimal
    reason: string
    orderId: string | null
    createdAt: Date
    _count: InventoryMovementCountAggregateOutputType | null
    _avg: InventoryMovementAvgAggregateOutputType | null
    _sum: InventoryMovementSumAggregateOutputType | null
    _min: InventoryMovementMinAggregateOutputType | null
    _max: InventoryMovementMaxAggregateOutputType | null
  }

  type GetInventoryMovementGroupByPayload<T extends InventoryMovementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryMovementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryMovementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryMovementGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryMovementGroupByOutputType[P]>
        }
      >
    >


  export type InventoryMovementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryItemId?: boolean
    delta?: boolean
    reason?: boolean
    orderId?: boolean
    createdAt?: boolean
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryMovement"]>

  export type InventoryMovementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryItemId?: boolean
    delta?: boolean
    reason?: boolean
    orderId?: boolean
    createdAt?: boolean
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryMovement"]>

  export type InventoryMovementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryItemId?: boolean
    delta?: boolean
    reason?: boolean
    orderId?: boolean
    createdAt?: boolean
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryMovement"]>

  export type InventoryMovementSelectScalar = {
    id?: boolean
    inventoryItemId?: boolean
    delta?: boolean
    reason?: boolean
    orderId?: boolean
    createdAt?: boolean
  }

  export type InventoryMovementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "inventoryItemId" | "delta" | "reason" | "orderId" | "createdAt", ExtArgs["result"]["inventoryMovement"]>
  export type InventoryMovementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }
  export type InventoryMovementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }
  export type InventoryMovementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventoryItem?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }

  export type $InventoryMovementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryMovement"
    objects: {
      inventoryItem: Prisma.$InventoryItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      inventoryItemId: string
      delta: Prisma.Decimal
      reason: string
      orderId: string | null
      createdAt: Date
    }, ExtArgs["result"]["inventoryMovement"]>
    composites: {}
  }

  type InventoryMovementGetPayload<S extends boolean | null | undefined | InventoryMovementDefaultArgs> = $Result.GetResult<Prisma.$InventoryMovementPayload, S>

  type InventoryMovementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryMovementCountAggregateInputType | true
    }

  export interface InventoryMovementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryMovement'], meta: { name: 'InventoryMovement' } }
    /**
     * Find zero or one InventoryMovement that matches the filter.
     * @param {InventoryMovementFindUniqueArgs} args - Arguments to find a InventoryMovement
     * @example
     * // Get one InventoryMovement
     * const inventoryMovement = await prisma.inventoryMovement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryMovementFindUniqueArgs>(args: SelectSubset<T, InventoryMovementFindUniqueArgs<ExtArgs>>): Prisma__InventoryMovementClient<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryMovement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryMovementFindUniqueOrThrowArgs} args - Arguments to find a InventoryMovement
     * @example
     * // Get one InventoryMovement
     * const inventoryMovement = await prisma.inventoryMovement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryMovementFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryMovementClient<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryMovement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryMovementFindFirstArgs} args - Arguments to find a InventoryMovement
     * @example
     * // Get one InventoryMovement
     * const inventoryMovement = await prisma.inventoryMovement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryMovementFindFirstArgs>(args?: SelectSubset<T, InventoryMovementFindFirstArgs<ExtArgs>>): Prisma__InventoryMovementClient<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryMovement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryMovementFindFirstOrThrowArgs} args - Arguments to find a InventoryMovement
     * @example
     * // Get one InventoryMovement
     * const inventoryMovement = await prisma.inventoryMovement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryMovementFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryMovementClient<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryMovements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryMovementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryMovements
     * const inventoryMovements = await prisma.inventoryMovement.findMany()
     * 
     * // Get first 10 InventoryMovements
     * const inventoryMovements = await prisma.inventoryMovement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryMovementWithIdOnly = await prisma.inventoryMovement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryMovementFindManyArgs>(args?: SelectSubset<T, InventoryMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryMovement.
     * @param {InventoryMovementCreateArgs} args - Arguments to create a InventoryMovement.
     * @example
     * // Create one InventoryMovement
     * const InventoryMovement = await prisma.inventoryMovement.create({
     *   data: {
     *     // ... data to create a InventoryMovement
     *   }
     * })
     * 
     */
    create<T extends InventoryMovementCreateArgs>(args: SelectSubset<T, InventoryMovementCreateArgs<ExtArgs>>): Prisma__InventoryMovementClient<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryMovements.
     * @param {InventoryMovementCreateManyArgs} args - Arguments to create many InventoryMovements.
     * @example
     * // Create many InventoryMovements
     * const inventoryMovement = await prisma.inventoryMovement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryMovementCreateManyArgs>(args?: SelectSubset<T, InventoryMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryMovements and returns the data saved in the database.
     * @param {InventoryMovementCreateManyAndReturnArgs} args - Arguments to create many InventoryMovements.
     * @example
     * // Create many InventoryMovements
     * const inventoryMovement = await prisma.inventoryMovement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryMovements and only return the `id`
     * const inventoryMovementWithIdOnly = await prisma.inventoryMovement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryMovementCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InventoryMovement.
     * @param {InventoryMovementDeleteArgs} args - Arguments to delete one InventoryMovement.
     * @example
     * // Delete one InventoryMovement
     * const InventoryMovement = await prisma.inventoryMovement.delete({
     *   where: {
     *     // ... filter to delete one InventoryMovement
     *   }
     * })
     * 
     */
    delete<T extends InventoryMovementDeleteArgs>(args: SelectSubset<T, InventoryMovementDeleteArgs<ExtArgs>>): Prisma__InventoryMovementClient<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryMovement.
     * @param {InventoryMovementUpdateArgs} args - Arguments to update one InventoryMovement.
     * @example
     * // Update one InventoryMovement
     * const inventoryMovement = await prisma.inventoryMovement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryMovementUpdateArgs>(args: SelectSubset<T, InventoryMovementUpdateArgs<ExtArgs>>): Prisma__InventoryMovementClient<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryMovements.
     * @param {InventoryMovementDeleteManyArgs} args - Arguments to filter InventoryMovements to delete.
     * @example
     * // Delete a few InventoryMovements
     * const { count } = await prisma.inventoryMovement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryMovementDeleteManyArgs>(args?: SelectSubset<T, InventoryMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryMovementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryMovements
     * const inventoryMovement = await prisma.inventoryMovement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryMovementUpdateManyArgs>(args: SelectSubset<T, InventoryMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryMovements and returns the data updated in the database.
     * @param {InventoryMovementUpdateManyAndReturnArgs} args - Arguments to update many InventoryMovements.
     * @example
     * // Update many InventoryMovements
     * const inventoryMovement = await prisma.inventoryMovement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InventoryMovements and only return the `id`
     * const inventoryMovementWithIdOnly = await prisma.inventoryMovement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InventoryMovementUpdateManyAndReturnArgs>(args: SelectSubset<T, InventoryMovementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InventoryMovement.
     * @param {InventoryMovementUpsertArgs} args - Arguments to update or create a InventoryMovement.
     * @example
     * // Update or create a InventoryMovement
     * const inventoryMovement = await prisma.inventoryMovement.upsert({
     *   create: {
     *     // ... data to create a InventoryMovement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryMovement we want to update
     *   }
     * })
     */
    upsert<T extends InventoryMovementUpsertArgs>(args: SelectSubset<T, InventoryMovementUpsertArgs<ExtArgs>>): Prisma__InventoryMovementClient<$Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryMovementCountArgs} args - Arguments to filter InventoryMovements to count.
     * @example
     * // Count the number of InventoryMovements
     * const count = await prisma.inventoryMovement.count({
     *   where: {
     *     // ... the filter for the InventoryMovements we want to count
     *   }
     * })
    **/
    count<T extends InventoryMovementCountArgs>(
      args?: Subset<T, InventoryMovementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryMovementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryMovementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryMovementAggregateArgs>(args: Subset<T, InventoryMovementAggregateArgs>): Prisma.PrismaPromise<GetInventoryMovementAggregateType<T>>

    /**
     * Group by InventoryMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryMovementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryMovementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryMovementGroupByArgs['orderBy'] }
        : { orderBy?: InventoryMovementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryMovement model
   */
  readonly fields: InventoryMovementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryMovement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryMovementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inventoryItem<T extends InventoryItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryItemDefaultArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InventoryMovement model
   */
  interface InventoryMovementFieldRefs {
    readonly id: FieldRef<"InventoryMovement", 'String'>
    readonly inventoryItemId: FieldRef<"InventoryMovement", 'String'>
    readonly delta: FieldRef<"InventoryMovement", 'Decimal'>
    readonly reason: FieldRef<"InventoryMovement", 'String'>
    readonly orderId: FieldRef<"InventoryMovement", 'String'>
    readonly createdAt: FieldRef<"InventoryMovement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryMovement findUnique
   */
  export type InventoryMovementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    /**
     * Filter, which InventoryMovement to fetch.
     */
    where: InventoryMovementWhereUniqueInput
  }

  /**
   * InventoryMovement findUniqueOrThrow
   */
  export type InventoryMovementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    /**
     * Filter, which InventoryMovement to fetch.
     */
    where: InventoryMovementWhereUniqueInput
  }

  /**
   * InventoryMovement findFirst
   */
  export type InventoryMovementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    /**
     * Filter, which InventoryMovement to fetch.
     */
    where?: InventoryMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryMovements to fetch.
     */
    orderBy?: InventoryMovementOrderByWithRelationInput | InventoryMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryMovements.
     */
    cursor?: InventoryMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryMovements.
     */
    distinct?: InventoryMovementScalarFieldEnum | InventoryMovementScalarFieldEnum[]
  }

  /**
   * InventoryMovement findFirstOrThrow
   */
  export type InventoryMovementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    /**
     * Filter, which InventoryMovement to fetch.
     */
    where?: InventoryMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryMovements to fetch.
     */
    orderBy?: InventoryMovementOrderByWithRelationInput | InventoryMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryMovements.
     */
    cursor?: InventoryMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryMovements.
     */
    distinct?: InventoryMovementScalarFieldEnum | InventoryMovementScalarFieldEnum[]
  }

  /**
   * InventoryMovement findMany
   */
  export type InventoryMovementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    /**
     * Filter, which InventoryMovements to fetch.
     */
    where?: InventoryMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryMovements to fetch.
     */
    orderBy?: InventoryMovementOrderByWithRelationInput | InventoryMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryMovements.
     */
    cursor?: InventoryMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryMovements.
     */
    distinct?: InventoryMovementScalarFieldEnum | InventoryMovementScalarFieldEnum[]
  }

  /**
   * InventoryMovement create
   */
  export type InventoryMovementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryMovement.
     */
    data: XOR<InventoryMovementCreateInput, InventoryMovementUncheckedCreateInput>
  }

  /**
   * InventoryMovement createMany
   */
  export type InventoryMovementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryMovements.
     */
    data: InventoryMovementCreateManyInput | InventoryMovementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryMovement createManyAndReturn
   */
  export type InventoryMovementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * The data used to create many InventoryMovements.
     */
    data: InventoryMovementCreateManyInput | InventoryMovementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryMovement update
   */
  export type InventoryMovementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryMovement.
     */
    data: XOR<InventoryMovementUpdateInput, InventoryMovementUncheckedUpdateInput>
    /**
     * Choose, which InventoryMovement to update.
     */
    where: InventoryMovementWhereUniqueInput
  }

  /**
   * InventoryMovement updateMany
   */
  export type InventoryMovementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryMovements.
     */
    data: XOR<InventoryMovementUpdateManyMutationInput, InventoryMovementUncheckedUpdateManyInput>
    /**
     * Filter which InventoryMovements to update
     */
    where?: InventoryMovementWhereInput
    /**
     * Limit how many InventoryMovements to update.
     */
    limit?: number
  }

  /**
   * InventoryMovement updateManyAndReturn
   */
  export type InventoryMovementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * The data used to update InventoryMovements.
     */
    data: XOR<InventoryMovementUpdateManyMutationInput, InventoryMovementUncheckedUpdateManyInput>
    /**
     * Filter which InventoryMovements to update
     */
    where?: InventoryMovementWhereInput
    /**
     * Limit how many InventoryMovements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryMovement upsert
   */
  export type InventoryMovementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryMovement to update in case it exists.
     */
    where: InventoryMovementWhereUniqueInput
    /**
     * In case the InventoryMovement found by the `where` argument doesn't exist, create a new InventoryMovement with this data.
     */
    create: XOR<InventoryMovementCreateInput, InventoryMovementUncheckedCreateInput>
    /**
     * In case the InventoryMovement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryMovementUpdateInput, InventoryMovementUncheckedUpdateInput>
  }

  /**
   * InventoryMovement delete
   */
  export type InventoryMovementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
    /**
     * Filter which InventoryMovement to delete.
     */
    where: InventoryMovementWhereUniqueInput
  }

  /**
   * InventoryMovement deleteMany
   */
  export type InventoryMovementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryMovements to delete
     */
    where?: InventoryMovementWhereInput
    /**
     * Limit how many InventoryMovements to delete.
     */
    limit?: number
  }

  /**
   * InventoryMovement without action
   */
  export type InventoryMovementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryMovement
     */
    select?: InventoryMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryMovement
     */
    omit?: InventoryMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryMovementInclude<ExtArgs> | null
  }


  /**
   * Model Table
   */

  export type AggregateTable = {
    _count: TableCountAggregateOutputType | null
    _avg: TableAvgAggregateOutputType | null
    _sum: TableSumAggregateOutputType | null
    _min: TableMinAggregateOutputType | null
    _max: TableMaxAggregateOutputType | null
  }

  export type TableAvgAggregateOutputType = {
    capacity: number | null
    occupancy: number | null
  }

  export type TableSumAggregateOutputType = {
    capacity: number | null
    occupancy: number | null
  }

  export type TableMinAggregateOutputType = {
    id: string | null
    name: string | null
    capacity: number | null
    occupancy: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TableMaxAggregateOutputType = {
    id: string | null
    name: string | null
    capacity: number | null
    occupancy: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TableCountAggregateOutputType = {
    id: number
    name: number
    capacity: number
    occupancy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TableAvgAggregateInputType = {
    capacity?: true
    occupancy?: true
  }

  export type TableSumAggregateInputType = {
    capacity?: true
    occupancy?: true
  }

  export type TableMinAggregateInputType = {
    id?: true
    name?: true
    capacity?: true
    occupancy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TableMaxAggregateInputType = {
    id?: true
    name?: true
    capacity?: true
    occupancy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TableCountAggregateInputType = {
    id?: true
    name?: true
    capacity?: true
    occupancy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TableAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Table to aggregate.
     */
    where?: TableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tables to fetch.
     */
    orderBy?: TableOrderByWithRelationInput | TableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tables
    **/
    _count?: true | TableCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TableAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TableSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TableMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TableMaxAggregateInputType
  }

  export type GetTableAggregateType<T extends TableAggregateArgs> = {
        [P in keyof T & keyof AggregateTable]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTable[P]>
      : GetScalarType<T[P], AggregateTable[P]>
  }




  export type TableGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TableWhereInput
    orderBy?: TableOrderByWithAggregationInput | TableOrderByWithAggregationInput[]
    by: TableScalarFieldEnum[] | TableScalarFieldEnum
    having?: TableScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TableCountAggregateInputType | true
    _avg?: TableAvgAggregateInputType
    _sum?: TableSumAggregateInputType
    _min?: TableMinAggregateInputType
    _max?: TableMaxAggregateInputType
  }

  export type TableGroupByOutputType = {
    id: string
    name: string
    capacity: number
    occupancy: number
    createdAt: Date
    updatedAt: Date
    _count: TableCountAggregateOutputType | null
    _avg: TableAvgAggregateOutputType | null
    _sum: TableSumAggregateOutputType | null
    _min: TableMinAggregateOutputType | null
    _max: TableMaxAggregateOutputType | null
  }

  type GetTableGroupByPayload<T extends TableGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TableGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TableGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TableGroupByOutputType[P]>
            : GetScalarType<T[P], TableGroupByOutputType[P]>
        }
      >
    >


  export type TableSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    capacity?: boolean
    occupancy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    orders?: boolean | Table$ordersArgs<ExtArgs>
    _count?: boolean | TableCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["table"]>

  export type TableSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    capacity?: boolean
    occupancy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["table"]>

  export type TableSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    capacity?: boolean
    occupancy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["table"]>

  export type TableSelectScalar = {
    id?: boolean
    name?: boolean
    capacity?: boolean
    occupancy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TableOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "capacity" | "occupancy" | "createdAt" | "updatedAt", ExtArgs["result"]["table"]>
  export type TableInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | Table$ordersArgs<ExtArgs>
    _count?: boolean | TableCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TableIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TableIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TablePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Table"
    objects: {
      orders: Prisma.$OrderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      capacity: number
      occupancy: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["table"]>
    composites: {}
  }

  type TableGetPayload<S extends boolean | null | undefined | TableDefaultArgs> = $Result.GetResult<Prisma.$TablePayload, S>

  type TableCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TableCountAggregateInputType | true
    }

  export interface TableDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Table'], meta: { name: 'Table' } }
    /**
     * Find zero or one Table that matches the filter.
     * @param {TableFindUniqueArgs} args - Arguments to find a Table
     * @example
     * // Get one Table
     * const table = await prisma.table.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TableFindUniqueArgs>(args: SelectSubset<T, TableFindUniqueArgs<ExtArgs>>): Prisma__TableClient<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Table that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TableFindUniqueOrThrowArgs} args - Arguments to find a Table
     * @example
     * // Get one Table
     * const table = await prisma.table.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TableFindUniqueOrThrowArgs>(args: SelectSubset<T, TableFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TableClient<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Table that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TableFindFirstArgs} args - Arguments to find a Table
     * @example
     * // Get one Table
     * const table = await prisma.table.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TableFindFirstArgs>(args?: SelectSubset<T, TableFindFirstArgs<ExtArgs>>): Prisma__TableClient<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Table that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TableFindFirstOrThrowArgs} args - Arguments to find a Table
     * @example
     * // Get one Table
     * const table = await prisma.table.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TableFindFirstOrThrowArgs>(args?: SelectSubset<T, TableFindFirstOrThrowArgs<ExtArgs>>): Prisma__TableClient<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tables that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TableFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tables
     * const tables = await prisma.table.findMany()
     * 
     * // Get first 10 Tables
     * const tables = await prisma.table.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tableWithIdOnly = await prisma.table.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TableFindManyArgs>(args?: SelectSubset<T, TableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Table.
     * @param {TableCreateArgs} args - Arguments to create a Table.
     * @example
     * // Create one Table
     * const Table = await prisma.table.create({
     *   data: {
     *     // ... data to create a Table
     *   }
     * })
     * 
     */
    create<T extends TableCreateArgs>(args: SelectSubset<T, TableCreateArgs<ExtArgs>>): Prisma__TableClient<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tables.
     * @param {TableCreateManyArgs} args - Arguments to create many Tables.
     * @example
     * // Create many Tables
     * const table = await prisma.table.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TableCreateManyArgs>(args?: SelectSubset<T, TableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tables and returns the data saved in the database.
     * @param {TableCreateManyAndReturnArgs} args - Arguments to create many Tables.
     * @example
     * // Create many Tables
     * const table = await prisma.table.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tables and only return the `id`
     * const tableWithIdOnly = await prisma.table.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TableCreateManyAndReturnArgs>(args?: SelectSubset<T, TableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Table.
     * @param {TableDeleteArgs} args - Arguments to delete one Table.
     * @example
     * // Delete one Table
     * const Table = await prisma.table.delete({
     *   where: {
     *     // ... filter to delete one Table
     *   }
     * })
     * 
     */
    delete<T extends TableDeleteArgs>(args: SelectSubset<T, TableDeleteArgs<ExtArgs>>): Prisma__TableClient<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Table.
     * @param {TableUpdateArgs} args - Arguments to update one Table.
     * @example
     * // Update one Table
     * const table = await prisma.table.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TableUpdateArgs>(args: SelectSubset<T, TableUpdateArgs<ExtArgs>>): Prisma__TableClient<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tables.
     * @param {TableDeleteManyArgs} args - Arguments to filter Tables to delete.
     * @example
     * // Delete a few Tables
     * const { count } = await prisma.table.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TableDeleteManyArgs>(args?: SelectSubset<T, TableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TableUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tables
     * const table = await prisma.table.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TableUpdateManyArgs>(args: SelectSubset<T, TableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tables and returns the data updated in the database.
     * @param {TableUpdateManyAndReturnArgs} args - Arguments to update many Tables.
     * @example
     * // Update many Tables
     * const table = await prisma.table.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tables and only return the `id`
     * const tableWithIdOnly = await prisma.table.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TableUpdateManyAndReturnArgs>(args: SelectSubset<T, TableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Table.
     * @param {TableUpsertArgs} args - Arguments to update or create a Table.
     * @example
     * // Update or create a Table
     * const table = await prisma.table.upsert({
     *   create: {
     *     // ... data to create a Table
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Table we want to update
     *   }
     * })
     */
    upsert<T extends TableUpsertArgs>(args: SelectSubset<T, TableUpsertArgs<ExtArgs>>): Prisma__TableClient<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TableCountArgs} args - Arguments to filter Tables to count.
     * @example
     * // Count the number of Tables
     * const count = await prisma.table.count({
     *   where: {
     *     // ... the filter for the Tables we want to count
     *   }
     * })
    **/
    count<T extends TableCountArgs>(
      args?: Subset<T, TableCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TableCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TableAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TableAggregateArgs>(args: Subset<T, TableAggregateArgs>): Prisma.PrismaPromise<GetTableAggregateType<T>>

    /**
     * Group by Table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TableGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TableGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TableGroupByArgs['orderBy'] }
        : { orderBy?: TableGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Table model
   */
  readonly fields: TableFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Table.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TableClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orders<T extends Table$ordersArgs<ExtArgs> = {}>(args?: Subset<T, Table$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Table model
   */
  interface TableFieldRefs {
    readonly id: FieldRef<"Table", 'String'>
    readonly name: FieldRef<"Table", 'String'>
    readonly capacity: FieldRef<"Table", 'Int'>
    readonly occupancy: FieldRef<"Table", 'Int'>
    readonly createdAt: FieldRef<"Table", 'DateTime'>
    readonly updatedAt: FieldRef<"Table", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Table findUnique
   */
  export type TableFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    /**
     * Filter, which Table to fetch.
     */
    where: TableWhereUniqueInput
  }

  /**
   * Table findUniqueOrThrow
   */
  export type TableFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    /**
     * Filter, which Table to fetch.
     */
    where: TableWhereUniqueInput
  }

  /**
   * Table findFirst
   */
  export type TableFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    /**
     * Filter, which Table to fetch.
     */
    where?: TableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tables to fetch.
     */
    orderBy?: TableOrderByWithRelationInput | TableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tables.
     */
    cursor?: TableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tables.
     */
    distinct?: TableScalarFieldEnum | TableScalarFieldEnum[]
  }

  /**
   * Table findFirstOrThrow
   */
  export type TableFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    /**
     * Filter, which Table to fetch.
     */
    where?: TableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tables to fetch.
     */
    orderBy?: TableOrderByWithRelationInput | TableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tables.
     */
    cursor?: TableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tables.
     */
    distinct?: TableScalarFieldEnum | TableScalarFieldEnum[]
  }

  /**
   * Table findMany
   */
  export type TableFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    /**
     * Filter, which Tables to fetch.
     */
    where?: TableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tables to fetch.
     */
    orderBy?: TableOrderByWithRelationInput | TableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tables.
     */
    cursor?: TableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tables.
     */
    distinct?: TableScalarFieldEnum | TableScalarFieldEnum[]
  }

  /**
   * Table create
   */
  export type TableCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    /**
     * The data needed to create a Table.
     */
    data: XOR<TableCreateInput, TableUncheckedCreateInput>
  }

  /**
   * Table createMany
   */
  export type TableCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tables.
     */
    data: TableCreateManyInput | TableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Table createManyAndReturn
   */
  export type TableCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * The data used to create many Tables.
     */
    data: TableCreateManyInput | TableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Table update
   */
  export type TableUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    /**
     * The data needed to update a Table.
     */
    data: XOR<TableUpdateInput, TableUncheckedUpdateInput>
    /**
     * Choose, which Table to update.
     */
    where: TableWhereUniqueInput
  }

  /**
   * Table updateMany
   */
  export type TableUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tables.
     */
    data: XOR<TableUpdateManyMutationInput, TableUncheckedUpdateManyInput>
    /**
     * Filter which Tables to update
     */
    where?: TableWhereInput
    /**
     * Limit how many Tables to update.
     */
    limit?: number
  }

  /**
   * Table updateManyAndReturn
   */
  export type TableUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * The data used to update Tables.
     */
    data: XOR<TableUpdateManyMutationInput, TableUncheckedUpdateManyInput>
    /**
     * Filter which Tables to update
     */
    where?: TableWhereInput
    /**
     * Limit how many Tables to update.
     */
    limit?: number
  }

  /**
   * Table upsert
   */
  export type TableUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    /**
     * The filter to search for the Table to update in case it exists.
     */
    where: TableWhereUniqueInput
    /**
     * In case the Table found by the `where` argument doesn't exist, create a new Table with this data.
     */
    create: XOR<TableCreateInput, TableUncheckedCreateInput>
    /**
     * In case the Table was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TableUpdateInput, TableUncheckedUpdateInput>
  }

  /**
   * Table delete
   */
  export type TableDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    /**
     * Filter which Table to delete.
     */
    where: TableWhereUniqueInput
  }

  /**
   * Table deleteMany
   */
  export type TableDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tables to delete
     */
    where?: TableWhereInput
    /**
     * Limit how many Tables to delete.
     */
    limit?: number
  }

  /**
   * Table.orders
   */
  export type Table$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Table without action
   */
  export type TableDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    subtotal: Decimal | null
    tax: Decimal | null
    tip: Decimal | null
    discount: Decimal | null
    total: Decimal | null
  }

  export type OrderSumAggregateOutputType = {
    subtotal: Decimal | null
    tax: Decimal | null
    tip: Decimal | null
    discount: Decimal | null
    total: Decimal | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    number: string | null
    status: $Enums.OrderStatus | null
    channel: string | null
    customerName: string | null
    customerPhone: string | null
    tableId: string | null
    staffId: string | null
    subtotal: Decimal | null
    tax: Decimal | null
    tip: Decimal | null
    discount: Decimal | null
    total: Decimal | null
    payment: $Enums.PaymentMethod | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    number: string | null
    status: $Enums.OrderStatus | null
    channel: string | null
    customerName: string | null
    customerPhone: string | null
    tableId: string | null
    staffId: string | null
    subtotal: Decimal | null
    tax: Decimal | null
    tip: Decimal | null
    discount: Decimal | null
    total: Decimal | null
    payment: $Enums.PaymentMethod | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    number: number
    status: number
    channel: number
    customerName: number
    customerPhone: number
    tableId: number
    staffId: number
    subtotal: number
    tax: number
    tip: number
    discount: number
    total: number
    payment: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    subtotal?: true
    tax?: true
    tip?: true
    discount?: true
    total?: true
  }

  export type OrderSumAggregateInputType = {
    subtotal?: true
    tax?: true
    tip?: true
    discount?: true
    total?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    number?: true
    status?: true
    channel?: true
    customerName?: true
    customerPhone?: true
    tableId?: true
    staffId?: true
    subtotal?: true
    tax?: true
    tip?: true
    discount?: true
    total?: true
    payment?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    number?: true
    status?: true
    channel?: true
    customerName?: true
    customerPhone?: true
    tableId?: true
    staffId?: true
    subtotal?: true
    tax?: true
    tip?: true
    discount?: true
    total?: true
    payment?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    number?: true
    status?: true
    channel?: true
    customerName?: true
    customerPhone?: true
    tableId?: true
    staffId?: true
    subtotal?: true
    tax?: true
    tip?: true
    discount?: true
    total?: true
    payment?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName: string | null
    customerPhone: string | null
    tableId: string | null
    staffId: string | null
    subtotal: Decimal
    tax: Decimal
    tip: Decimal | null
    discount: Decimal | null
    total: Decimal
    payment: $Enums.PaymentMethod
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    number?: boolean
    status?: boolean
    channel?: boolean
    customerName?: boolean
    customerPhone?: boolean
    tableId?: boolean
    staffId?: boolean
    subtotal?: boolean
    tax?: boolean
    tip?: boolean
    discount?: boolean
    total?: boolean
    payment?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    table?: boolean | Order$tableArgs<ExtArgs>
    staff?: boolean | Order$staffArgs<ExtArgs>
    items?: boolean | Order$itemsArgs<ExtArgs>
    tickets?: boolean | Order$ticketsArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    number?: boolean
    status?: boolean
    channel?: boolean
    customerName?: boolean
    customerPhone?: boolean
    tableId?: boolean
    staffId?: boolean
    subtotal?: boolean
    tax?: boolean
    tip?: boolean
    discount?: boolean
    total?: boolean
    payment?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    table?: boolean | Order$tableArgs<ExtArgs>
    staff?: boolean | Order$staffArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    number?: boolean
    status?: boolean
    channel?: boolean
    customerName?: boolean
    customerPhone?: boolean
    tableId?: boolean
    staffId?: boolean
    subtotal?: boolean
    tax?: boolean
    tip?: boolean
    discount?: boolean
    total?: boolean
    payment?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    table?: boolean | Order$tableArgs<ExtArgs>
    staff?: boolean | Order$staffArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    number?: boolean
    status?: boolean
    channel?: boolean
    customerName?: boolean
    customerPhone?: boolean
    tableId?: boolean
    staffId?: boolean
    subtotal?: boolean
    tax?: boolean
    tip?: boolean
    discount?: boolean
    total?: boolean
    payment?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "number" | "status" | "channel" | "customerName" | "customerPhone" | "tableId" | "staffId" | "subtotal" | "tax" | "tip" | "discount" | "total" | "payment" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["order"]>
  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    table?: boolean | Order$tableArgs<ExtArgs>
    staff?: boolean | Order$staffArgs<ExtArgs>
    items?: boolean | Order$itemsArgs<ExtArgs>
    tickets?: boolean | Order$ticketsArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    table?: boolean | Order$tableArgs<ExtArgs>
    staff?: boolean | Order$staffArgs<ExtArgs>
  }
  export type OrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    table?: boolean | Order$tableArgs<ExtArgs>
    staff?: boolean | Order$staffArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      table: Prisma.$TablePayload<ExtArgs> | null
      staff: Prisma.$UserPayload<ExtArgs> | null
      items: Prisma.$OrderItemPayload<ExtArgs>[]
      tickets: Prisma.$KitchenTicketPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      number: string
      status: $Enums.OrderStatus
      /**
       * Free-text channel ("dine-in" / "takeaway" / "delivery" / "online").
       * Kept as a string because "dine-in" can't appear in a Postgres enum.
       */
      channel: string
      customerName: string | null
      customerPhone: string | null
      tableId: string | null
      staffId: string | null
      subtotal: Prisma.Decimal
      tax: Prisma.Decimal
      tip: Prisma.Decimal | null
      discount: Prisma.Decimal | null
      total: Prisma.Decimal
      payment: $Enums.PaymentMethod
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders and returns the data updated in the database.
     * @param {OrderUpdateManyAndReturnArgs} args - Arguments to update many Orders.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    table<T extends Order$tableArgs<ExtArgs> = {}>(args?: Subset<T, Order$tableArgs<ExtArgs>>): Prisma__TableClient<$Result.GetResult<Prisma.$TablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    staff<T extends Order$staffArgs<ExtArgs> = {}>(args?: Subset<T, Order$staffArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    items<T extends Order$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Order$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tickets<T extends Order$ticketsArgs<ExtArgs> = {}>(args?: Subset<T, Order$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly number: FieldRef<"Order", 'String'>
    readonly status: FieldRef<"Order", 'OrderStatus'>
    readonly channel: FieldRef<"Order", 'String'>
    readonly customerName: FieldRef<"Order", 'String'>
    readonly customerPhone: FieldRef<"Order", 'String'>
    readonly tableId: FieldRef<"Order", 'String'>
    readonly staffId: FieldRef<"Order", 'String'>
    readonly subtotal: FieldRef<"Order", 'Decimal'>
    readonly tax: FieldRef<"Order", 'Decimal'>
    readonly tip: FieldRef<"Order", 'Decimal'>
    readonly discount: FieldRef<"Order", 'Decimal'>
    readonly total: FieldRef<"Order", 'Decimal'>
    readonly payment: FieldRef<"Order", 'PaymentMethod'>
    readonly notes: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly updatedAt: FieldRef<"Order", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order updateManyAndReturn
   */
  export type OrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to delete.
     */
    limit?: number
  }

  /**
   * Order.table
   */
  export type Order$tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Table
     */
    select?: TableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Table
     */
    omit?: TableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TableInclude<ExtArgs> | null
    where?: TableWhereInput
  }

  /**
   * Order.staff
   */
  export type Order$staffArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Order.items
   */
  export type Order$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    where?: OrderItemWhereInput
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    cursor?: OrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * Order.tickets
   */
  export type Order$ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    where?: KitchenTicketWhereInput
    orderBy?: KitchenTicketOrderByWithRelationInput | KitchenTicketOrderByWithRelationInput[]
    cursor?: KitchenTicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KitchenTicketScalarFieldEnum | KitchenTicketScalarFieldEnum[]
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model OrderItem
   */

  export type AggregateOrderItem = {
    _count: OrderItemCountAggregateOutputType | null
    _avg: OrderItemAvgAggregateOutputType | null
    _sum: OrderItemSumAggregateOutputType | null
    _min: OrderItemMinAggregateOutputType | null
    _max: OrderItemMaxAggregateOutputType | null
  }

  export type OrderItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: Decimal | null
  }

  export type OrderItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: Decimal | null
  }

  export type OrderItemMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    menuItemId: string | null
    name: string | null
    quantity: number | null
    unitPrice: Decimal | null
    note: string | null
  }

  export type OrderItemMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    menuItemId: string | null
    name: string | null
    quantity: number | null
    unitPrice: Decimal | null
    note: string | null
  }

  export type OrderItemCountAggregateOutputType = {
    id: number
    orderId: number
    menuItemId: number
    name: number
    quantity: number
    unitPrice: number
    modifiers: number
    note: number
    _all: number
  }


  export type OrderItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
  }

  export type OrderItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
  }

  export type OrderItemMinAggregateInputType = {
    id?: true
    orderId?: true
    menuItemId?: true
    name?: true
    quantity?: true
    unitPrice?: true
    note?: true
  }

  export type OrderItemMaxAggregateInputType = {
    id?: true
    orderId?: true
    menuItemId?: true
    name?: true
    quantity?: true
    unitPrice?: true
    note?: true
  }

  export type OrderItemCountAggregateInputType = {
    id?: true
    orderId?: true
    menuItemId?: true
    name?: true
    quantity?: true
    unitPrice?: true
    modifiers?: true
    note?: true
    _all?: true
  }

  export type OrderItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderItem to aggregate.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderItems
    **/
    _count?: true | OrderItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderItemMaxAggregateInputType
  }

  export type GetOrderItemAggregateType<T extends OrderItemAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderItem[P]>
      : GetScalarType<T[P], AggregateOrderItem[P]>
  }




  export type OrderItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderItemWhereInput
    orderBy?: OrderItemOrderByWithAggregationInput | OrderItemOrderByWithAggregationInput[]
    by: OrderItemScalarFieldEnum[] | OrderItemScalarFieldEnum
    having?: OrderItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderItemCountAggregateInputType | true
    _avg?: OrderItemAvgAggregateInputType
    _sum?: OrderItemSumAggregateInputType
    _min?: OrderItemMinAggregateInputType
    _max?: OrderItemMaxAggregateInputType
  }

  export type OrderItemGroupByOutputType = {
    id: string
    orderId: string
    menuItemId: string
    name: string
    quantity: number
    unitPrice: Decimal
    modifiers: JsonValue | null
    note: string | null
    _count: OrderItemCountAggregateOutputType | null
    _avg: OrderItemAvgAggregateOutputType | null
    _sum: OrderItemSumAggregateOutputType | null
    _min: OrderItemMinAggregateOutputType | null
    _max: OrderItemMaxAggregateOutputType | null
  }

  type GetOrderItemGroupByPayload<T extends OrderItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderItemGroupByOutputType[P]>
            : GetScalarType<T[P], OrderItemGroupByOutputType[P]>
        }
      >
    >


  export type OrderItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    menuItemId?: boolean
    name?: boolean
    quantity?: boolean
    unitPrice?: boolean
    modifiers?: boolean
    note?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderItem"]>

  export type OrderItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    menuItemId?: boolean
    name?: boolean
    quantity?: boolean
    unitPrice?: boolean
    modifiers?: boolean
    note?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderItem"]>

  export type OrderItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    menuItemId?: boolean
    name?: boolean
    quantity?: boolean
    unitPrice?: boolean
    modifiers?: boolean
    note?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderItem"]>

  export type OrderItemSelectScalar = {
    id?: boolean
    orderId?: boolean
    menuItemId?: boolean
    name?: boolean
    quantity?: boolean
    unitPrice?: boolean
    modifiers?: boolean
    note?: boolean
  }

  export type OrderItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "menuItemId" | "name" | "quantity" | "unitPrice" | "modifiers" | "note", ExtArgs["result"]["orderItem"]>
  export type OrderItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
  }
  export type OrderItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
  }
  export type OrderItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    menuItem?: boolean | MenuItemDefaultArgs<ExtArgs>
  }

  export type $OrderItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderItem"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
      menuItem: Prisma.$MenuItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      menuItemId: string
      /**
       * Denormalized at the time of sale so historical orders stay legible
       * even if the underlying menu item is renamed or deleted.
       */
      name: string
      quantity: number
      unitPrice: Prisma.Decimal
      modifiers: Prisma.JsonValue | null
      note: string | null
    }, ExtArgs["result"]["orderItem"]>
    composites: {}
  }

  type OrderItemGetPayload<S extends boolean | null | undefined | OrderItemDefaultArgs> = $Result.GetResult<Prisma.$OrderItemPayload, S>

  type OrderItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderItemCountAggregateInputType | true
    }

  export interface OrderItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderItem'], meta: { name: 'OrderItem' } }
    /**
     * Find zero or one OrderItem that matches the filter.
     * @param {OrderItemFindUniqueArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderItemFindUniqueArgs>(args: SelectSubset<T, OrderItemFindUniqueArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrderItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderItemFindUniqueOrThrowArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderItemFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindFirstArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderItemFindFirstArgs>(args?: SelectSubset<T, OrderItemFindFirstArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindFirstOrThrowArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderItemFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrderItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderItems
     * const orderItems = await prisma.orderItem.findMany()
     * 
     * // Get first 10 OrderItems
     * const orderItems = await prisma.orderItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderItemWithIdOnly = await prisma.orderItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderItemFindManyArgs>(args?: SelectSubset<T, OrderItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrderItem.
     * @param {OrderItemCreateArgs} args - Arguments to create a OrderItem.
     * @example
     * // Create one OrderItem
     * const OrderItem = await prisma.orderItem.create({
     *   data: {
     *     // ... data to create a OrderItem
     *   }
     * })
     * 
     */
    create<T extends OrderItemCreateArgs>(args: SelectSubset<T, OrderItemCreateArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrderItems.
     * @param {OrderItemCreateManyArgs} args - Arguments to create many OrderItems.
     * @example
     * // Create many OrderItems
     * const orderItem = await prisma.orderItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderItemCreateManyArgs>(args?: SelectSubset<T, OrderItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrderItems and returns the data saved in the database.
     * @param {OrderItemCreateManyAndReturnArgs} args - Arguments to create many OrderItems.
     * @example
     * // Create many OrderItems
     * const orderItem = await prisma.orderItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrderItems and only return the `id`
     * const orderItemWithIdOnly = await prisma.orderItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderItemCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrderItem.
     * @param {OrderItemDeleteArgs} args - Arguments to delete one OrderItem.
     * @example
     * // Delete one OrderItem
     * const OrderItem = await prisma.orderItem.delete({
     *   where: {
     *     // ... filter to delete one OrderItem
     *   }
     * })
     * 
     */
    delete<T extends OrderItemDeleteArgs>(args: SelectSubset<T, OrderItemDeleteArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrderItem.
     * @param {OrderItemUpdateArgs} args - Arguments to update one OrderItem.
     * @example
     * // Update one OrderItem
     * const orderItem = await prisma.orderItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderItemUpdateArgs>(args: SelectSubset<T, OrderItemUpdateArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrderItems.
     * @param {OrderItemDeleteManyArgs} args - Arguments to filter OrderItems to delete.
     * @example
     * // Delete a few OrderItems
     * const { count } = await prisma.orderItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderItemDeleteManyArgs>(args?: SelectSubset<T, OrderItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderItems
     * const orderItem = await prisma.orderItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderItemUpdateManyArgs>(args: SelectSubset<T, OrderItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderItems and returns the data updated in the database.
     * @param {OrderItemUpdateManyAndReturnArgs} args - Arguments to update many OrderItems.
     * @example
     * // Update many OrderItems
     * const orderItem = await prisma.orderItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrderItems and only return the `id`
     * const orderItemWithIdOnly = await prisma.orderItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderItemUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrderItem.
     * @param {OrderItemUpsertArgs} args - Arguments to update or create a OrderItem.
     * @example
     * // Update or create a OrderItem
     * const orderItem = await prisma.orderItem.upsert({
     *   create: {
     *     // ... data to create a OrderItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderItem we want to update
     *   }
     * })
     */
    upsert<T extends OrderItemUpsertArgs>(args: SelectSubset<T, OrderItemUpsertArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemCountArgs} args - Arguments to filter OrderItems to count.
     * @example
     * // Count the number of OrderItems
     * const count = await prisma.orderItem.count({
     *   where: {
     *     // ... the filter for the OrderItems we want to count
     *   }
     * })
    **/
    count<T extends OrderItemCountArgs>(
      args?: Subset<T, OrderItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderItemAggregateArgs>(args: Subset<T, OrderItemAggregateArgs>): Prisma.PrismaPromise<GetOrderItemAggregateType<T>>

    /**
     * Group by OrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderItemGroupByArgs['orderBy'] }
        : { orderBy?: OrderItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderItem model
   */
  readonly fields: OrderItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    menuItem<T extends MenuItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MenuItemDefaultArgs<ExtArgs>>): Prisma__MenuItemClient<$Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrderItem model
   */
  interface OrderItemFieldRefs {
    readonly id: FieldRef<"OrderItem", 'String'>
    readonly orderId: FieldRef<"OrderItem", 'String'>
    readonly menuItemId: FieldRef<"OrderItem", 'String'>
    readonly name: FieldRef<"OrderItem", 'String'>
    readonly quantity: FieldRef<"OrderItem", 'Int'>
    readonly unitPrice: FieldRef<"OrderItem", 'Decimal'>
    readonly modifiers: FieldRef<"OrderItem", 'Json'>
    readonly note: FieldRef<"OrderItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * OrderItem findUnique
   */
  export type OrderItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem findUniqueOrThrow
   */
  export type OrderItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem findFirst
   */
  export type OrderItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * OrderItem findFirstOrThrow
   */
  export type OrderItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * OrderItem findMany
   */
  export type OrderItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItems to fetch.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * OrderItem create
   */
  export type OrderItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * The data needed to create a OrderItem.
     */
    data: XOR<OrderItemCreateInput, OrderItemUncheckedCreateInput>
  }

  /**
   * OrderItem createMany
   */
  export type OrderItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderItems.
     */
    data: OrderItemCreateManyInput | OrderItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderItem createManyAndReturn
   */
  export type OrderItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * The data used to create many OrderItems.
     */
    data: OrderItemCreateManyInput | OrderItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderItem update
   */
  export type OrderItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * The data needed to update a OrderItem.
     */
    data: XOR<OrderItemUpdateInput, OrderItemUncheckedUpdateInput>
    /**
     * Choose, which OrderItem to update.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem updateMany
   */
  export type OrderItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderItems.
     */
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyInput>
    /**
     * Filter which OrderItems to update
     */
    where?: OrderItemWhereInput
    /**
     * Limit how many OrderItems to update.
     */
    limit?: number
  }

  /**
   * OrderItem updateManyAndReturn
   */
  export type OrderItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * The data used to update OrderItems.
     */
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyInput>
    /**
     * Filter which OrderItems to update
     */
    where?: OrderItemWhereInput
    /**
     * Limit how many OrderItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderItem upsert
   */
  export type OrderItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * The filter to search for the OrderItem to update in case it exists.
     */
    where: OrderItemWhereUniqueInput
    /**
     * In case the OrderItem found by the `where` argument doesn't exist, create a new OrderItem with this data.
     */
    create: XOR<OrderItemCreateInput, OrderItemUncheckedCreateInput>
    /**
     * In case the OrderItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderItemUpdateInput, OrderItemUncheckedUpdateInput>
  }

  /**
   * OrderItem delete
   */
  export type OrderItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter which OrderItem to delete.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem deleteMany
   */
  export type OrderItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderItems to delete
     */
    where?: OrderItemWhereInput
    /**
     * Limit how many OrderItems to delete.
     */
    limit?: number
  }

  /**
   * OrderItem without action
   */
  export type OrderItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
  }


  /**
   * Model KitchenTicket
   */

  export type AggregateKitchenTicket = {
    _count: KitchenTicketCountAggregateOutputType | null
    _min: KitchenTicketMinAggregateOutputType | null
    _max: KitchenTicketMaxAggregateOutputType | null
  }

  export type KitchenTicketMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    stationId: string | null
    status: $Enums.TicketStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KitchenTicketMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    stationId: string | null
    status: $Enums.TicketStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KitchenTicketCountAggregateOutputType = {
    id: number
    orderId: number
    stationId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KitchenTicketMinAggregateInputType = {
    id?: true
    orderId?: true
    stationId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KitchenTicketMaxAggregateInputType = {
    id?: true
    orderId?: true
    stationId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KitchenTicketCountAggregateInputType = {
    id?: true
    orderId?: true
    stationId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KitchenTicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KitchenTicket to aggregate.
     */
    where?: KitchenTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KitchenTickets to fetch.
     */
    orderBy?: KitchenTicketOrderByWithRelationInput | KitchenTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KitchenTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KitchenTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KitchenTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KitchenTickets
    **/
    _count?: true | KitchenTicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KitchenTicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KitchenTicketMaxAggregateInputType
  }

  export type GetKitchenTicketAggregateType<T extends KitchenTicketAggregateArgs> = {
        [P in keyof T & keyof AggregateKitchenTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKitchenTicket[P]>
      : GetScalarType<T[P], AggregateKitchenTicket[P]>
  }




  export type KitchenTicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KitchenTicketWhereInput
    orderBy?: KitchenTicketOrderByWithAggregationInput | KitchenTicketOrderByWithAggregationInput[]
    by: KitchenTicketScalarFieldEnum[] | KitchenTicketScalarFieldEnum
    having?: KitchenTicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KitchenTicketCountAggregateInputType | true
    _min?: KitchenTicketMinAggregateInputType
    _max?: KitchenTicketMaxAggregateInputType
  }

  export type KitchenTicketGroupByOutputType = {
    id: string
    orderId: string
    stationId: string
    status: $Enums.TicketStatus
    createdAt: Date
    updatedAt: Date
    _count: KitchenTicketCountAggregateOutputType | null
    _min: KitchenTicketMinAggregateOutputType | null
    _max: KitchenTicketMaxAggregateOutputType | null
  }

  type GetKitchenTicketGroupByPayload<T extends KitchenTicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KitchenTicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KitchenTicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KitchenTicketGroupByOutputType[P]>
            : GetScalarType<T[P], KitchenTicketGroupByOutputType[P]>
        }
      >
    >


  export type KitchenTicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    stationId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kitchenTicket"]>

  export type KitchenTicketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    stationId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kitchenTicket"]>

  export type KitchenTicketSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    stationId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kitchenTicket"]>

  export type KitchenTicketSelectScalar = {
    id?: boolean
    orderId?: boolean
    stationId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KitchenTicketOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "stationId" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["kitchenTicket"]>
  export type KitchenTicketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }
  export type KitchenTicketIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }
  export type KitchenTicketIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    station?: boolean | KitchenStationDefaultArgs<ExtArgs>
  }

  export type $KitchenTicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KitchenTicket"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
      station: Prisma.$KitchenStationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      stationId: string
      status: $Enums.TicketStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kitchenTicket"]>
    composites: {}
  }

  type KitchenTicketGetPayload<S extends boolean | null | undefined | KitchenTicketDefaultArgs> = $Result.GetResult<Prisma.$KitchenTicketPayload, S>

  type KitchenTicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KitchenTicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KitchenTicketCountAggregateInputType | true
    }

  export interface KitchenTicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KitchenTicket'], meta: { name: 'KitchenTicket' } }
    /**
     * Find zero or one KitchenTicket that matches the filter.
     * @param {KitchenTicketFindUniqueArgs} args - Arguments to find a KitchenTicket
     * @example
     * // Get one KitchenTicket
     * const kitchenTicket = await prisma.kitchenTicket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KitchenTicketFindUniqueArgs>(args: SelectSubset<T, KitchenTicketFindUniqueArgs<ExtArgs>>): Prisma__KitchenTicketClient<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KitchenTicket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KitchenTicketFindUniqueOrThrowArgs} args - Arguments to find a KitchenTicket
     * @example
     * // Get one KitchenTicket
     * const kitchenTicket = await prisma.kitchenTicket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KitchenTicketFindUniqueOrThrowArgs>(args: SelectSubset<T, KitchenTicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KitchenTicketClient<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KitchenTicket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenTicketFindFirstArgs} args - Arguments to find a KitchenTicket
     * @example
     * // Get one KitchenTicket
     * const kitchenTicket = await prisma.kitchenTicket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KitchenTicketFindFirstArgs>(args?: SelectSubset<T, KitchenTicketFindFirstArgs<ExtArgs>>): Prisma__KitchenTicketClient<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KitchenTicket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenTicketFindFirstOrThrowArgs} args - Arguments to find a KitchenTicket
     * @example
     * // Get one KitchenTicket
     * const kitchenTicket = await prisma.kitchenTicket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KitchenTicketFindFirstOrThrowArgs>(args?: SelectSubset<T, KitchenTicketFindFirstOrThrowArgs<ExtArgs>>): Prisma__KitchenTicketClient<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KitchenTickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenTicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KitchenTickets
     * const kitchenTickets = await prisma.kitchenTicket.findMany()
     * 
     * // Get first 10 KitchenTickets
     * const kitchenTickets = await prisma.kitchenTicket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kitchenTicketWithIdOnly = await prisma.kitchenTicket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KitchenTicketFindManyArgs>(args?: SelectSubset<T, KitchenTicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KitchenTicket.
     * @param {KitchenTicketCreateArgs} args - Arguments to create a KitchenTicket.
     * @example
     * // Create one KitchenTicket
     * const KitchenTicket = await prisma.kitchenTicket.create({
     *   data: {
     *     // ... data to create a KitchenTicket
     *   }
     * })
     * 
     */
    create<T extends KitchenTicketCreateArgs>(args: SelectSubset<T, KitchenTicketCreateArgs<ExtArgs>>): Prisma__KitchenTicketClient<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KitchenTickets.
     * @param {KitchenTicketCreateManyArgs} args - Arguments to create many KitchenTickets.
     * @example
     * // Create many KitchenTickets
     * const kitchenTicket = await prisma.kitchenTicket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KitchenTicketCreateManyArgs>(args?: SelectSubset<T, KitchenTicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KitchenTickets and returns the data saved in the database.
     * @param {KitchenTicketCreateManyAndReturnArgs} args - Arguments to create many KitchenTickets.
     * @example
     * // Create many KitchenTickets
     * const kitchenTicket = await prisma.kitchenTicket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KitchenTickets and only return the `id`
     * const kitchenTicketWithIdOnly = await prisma.kitchenTicket.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KitchenTicketCreateManyAndReturnArgs>(args?: SelectSubset<T, KitchenTicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KitchenTicket.
     * @param {KitchenTicketDeleteArgs} args - Arguments to delete one KitchenTicket.
     * @example
     * // Delete one KitchenTicket
     * const KitchenTicket = await prisma.kitchenTicket.delete({
     *   where: {
     *     // ... filter to delete one KitchenTicket
     *   }
     * })
     * 
     */
    delete<T extends KitchenTicketDeleteArgs>(args: SelectSubset<T, KitchenTicketDeleteArgs<ExtArgs>>): Prisma__KitchenTicketClient<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KitchenTicket.
     * @param {KitchenTicketUpdateArgs} args - Arguments to update one KitchenTicket.
     * @example
     * // Update one KitchenTicket
     * const kitchenTicket = await prisma.kitchenTicket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KitchenTicketUpdateArgs>(args: SelectSubset<T, KitchenTicketUpdateArgs<ExtArgs>>): Prisma__KitchenTicketClient<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KitchenTickets.
     * @param {KitchenTicketDeleteManyArgs} args - Arguments to filter KitchenTickets to delete.
     * @example
     * // Delete a few KitchenTickets
     * const { count } = await prisma.kitchenTicket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KitchenTicketDeleteManyArgs>(args?: SelectSubset<T, KitchenTicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KitchenTickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenTicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KitchenTickets
     * const kitchenTicket = await prisma.kitchenTicket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KitchenTicketUpdateManyArgs>(args: SelectSubset<T, KitchenTicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KitchenTickets and returns the data updated in the database.
     * @param {KitchenTicketUpdateManyAndReturnArgs} args - Arguments to update many KitchenTickets.
     * @example
     * // Update many KitchenTickets
     * const kitchenTicket = await prisma.kitchenTicket.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KitchenTickets and only return the `id`
     * const kitchenTicketWithIdOnly = await prisma.kitchenTicket.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KitchenTicketUpdateManyAndReturnArgs>(args: SelectSubset<T, KitchenTicketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KitchenTicket.
     * @param {KitchenTicketUpsertArgs} args - Arguments to update or create a KitchenTicket.
     * @example
     * // Update or create a KitchenTicket
     * const kitchenTicket = await prisma.kitchenTicket.upsert({
     *   create: {
     *     // ... data to create a KitchenTicket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KitchenTicket we want to update
     *   }
     * })
     */
    upsert<T extends KitchenTicketUpsertArgs>(args: SelectSubset<T, KitchenTicketUpsertArgs<ExtArgs>>): Prisma__KitchenTicketClient<$Result.GetResult<Prisma.$KitchenTicketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KitchenTickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenTicketCountArgs} args - Arguments to filter KitchenTickets to count.
     * @example
     * // Count the number of KitchenTickets
     * const count = await prisma.kitchenTicket.count({
     *   where: {
     *     // ... the filter for the KitchenTickets we want to count
     *   }
     * })
    **/
    count<T extends KitchenTicketCountArgs>(
      args?: Subset<T, KitchenTicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KitchenTicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KitchenTicket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenTicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KitchenTicketAggregateArgs>(args: Subset<T, KitchenTicketAggregateArgs>): Prisma.PrismaPromise<GetKitchenTicketAggregateType<T>>

    /**
     * Group by KitchenTicket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KitchenTicketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KitchenTicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KitchenTicketGroupByArgs['orderBy'] }
        : { orderBy?: KitchenTicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KitchenTicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKitchenTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KitchenTicket model
   */
  readonly fields: KitchenTicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KitchenTicket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KitchenTicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    station<T extends KitchenStationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KitchenStationDefaultArgs<ExtArgs>>): Prisma__KitchenStationClient<$Result.GetResult<Prisma.$KitchenStationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KitchenTicket model
   */
  interface KitchenTicketFieldRefs {
    readonly id: FieldRef<"KitchenTicket", 'String'>
    readonly orderId: FieldRef<"KitchenTicket", 'String'>
    readonly stationId: FieldRef<"KitchenTicket", 'String'>
    readonly status: FieldRef<"KitchenTicket", 'TicketStatus'>
    readonly createdAt: FieldRef<"KitchenTicket", 'DateTime'>
    readonly updatedAt: FieldRef<"KitchenTicket", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KitchenTicket findUnique
   */
  export type KitchenTicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    /**
     * Filter, which KitchenTicket to fetch.
     */
    where: KitchenTicketWhereUniqueInput
  }

  /**
   * KitchenTicket findUniqueOrThrow
   */
  export type KitchenTicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    /**
     * Filter, which KitchenTicket to fetch.
     */
    where: KitchenTicketWhereUniqueInput
  }

  /**
   * KitchenTicket findFirst
   */
  export type KitchenTicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    /**
     * Filter, which KitchenTicket to fetch.
     */
    where?: KitchenTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KitchenTickets to fetch.
     */
    orderBy?: KitchenTicketOrderByWithRelationInput | KitchenTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KitchenTickets.
     */
    cursor?: KitchenTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KitchenTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KitchenTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KitchenTickets.
     */
    distinct?: KitchenTicketScalarFieldEnum | KitchenTicketScalarFieldEnum[]
  }

  /**
   * KitchenTicket findFirstOrThrow
   */
  export type KitchenTicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    /**
     * Filter, which KitchenTicket to fetch.
     */
    where?: KitchenTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KitchenTickets to fetch.
     */
    orderBy?: KitchenTicketOrderByWithRelationInput | KitchenTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KitchenTickets.
     */
    cursor?: KitchenTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KitchenTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KitchenTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KitchenTickets.
     */
    distinct?: KitchenTicketScalarFieldEnum | KitchenTicketScalarFieldEnum[]
  }

  /**
   * KitchenTicket findMany
   */
  export type KitchenTicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    /**
     * Filter, which KitchenTickets to fetch.
     */
    where?: KitchenTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KitchenTickets to fetch.
     */
    orderBy?: KitchenTicketOrderByWithRelationInput | KitchenTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KitchenTickets.
     */
    cursor?: KitchenTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KitchenTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KitchenTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KitchenTickets.
     */
    distinct?: KitchenTicketScalarFieldEnum | KitchenTicketScalarFieldEnum[]
  }

  /**
   * KitchenTicket create
   */
  export type KitchenTicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    /**
     * The data needed to create a KitchenTicket.
     */
    data: XOR<KitchenTicketCreateInput, KitchenTicketUncheckedCreateInput>
  }

  /**
   * KitchenTicket createMany
   */
  export type KitchenTicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KitchenTickets.
     */
    data: KitchenTicketCreateManyInput | KitchenTicketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KitchenTicket createManyAndReturn
   */
  export type KitchenTicketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * The data used to create many KitchenTickets.
     */
    data: KitchenTicketCreateManyInput | KitchenTicketCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KitchenTicket update
   */
  export type KitchenTicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    /**
     * The data needed to update a KitchenTicket.
     */
    data: XOR<KitchenTicketUpdateInput, KitchenTicketUncheckedUpdateInput>
    /**
     * Choose, which KitchenTicket to update.
     */
    where: KitchenTicketWhereUniqueInput
  }

  /**
   * KitchenTicket updateMany
   */
  export type KitchenTicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KitchenTickets.
     */
    data: XOR<KitchenTicketUpdateManyMutationInput, KitchenTicketUncheckedUpdateManyInput>
    /**
     * Filter which KitchenTickets to update
     */
    where?: KitchenTicketWhereInput
    /**
     * Limit how many KitchenTickets to update.
     */
    limit?: number
  }

  /**
   * KitchenTicket updateManyAndReturn
   */
  export type KitchenTicketUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * The data used to update KitchenTickets.
     */
    data: XOR<KitchenTicketUpdateManyMutationInput, KitchenTicketUncheckedUpdateManyInput>
    /**
     * Filter which KitchenTickets to update
     */
    where?: KitchenTicketWhereInput
    /**
     * Limit how many KitchenTickets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KitchenTicket upsert
   */
  export type KitchenTicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    /**
     * The filter to search for the KitchenTicket to update in case it exists.
     */
    where: KitchenTicketWhereUniqueInput
    /**
     * In case the KitchenTicket found by the `where` argument doesn't exist, create a new KitchenTicket with this data.
     */
    create: XOR<KitchenTicketCreateInput, KitchenTicketUncheckedCreateInput>
    /**
     * In case the KitchenTicket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KitchenTicketUpdateInput, KitchenTicketUncheckedUpdateInput>
  }

  /**
   * KitchenTicket delete
   */
  export type KitchenTicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
    /**
     * Filter which KitchenTicket to delete.
     */
    where: KitchenTicketWhereUniqueInput
  }

  /**
   * KitchenTicket deleteMany
   */
  export type KitchenTicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KitchenTickets to delete
     */
    where?: KitchenTicketWhereInput
    /**
     * Limit how many KitchenTickets to delete.
     */
    limit?: number
  }

  /**
   * KitchenTicket without action
   */
  export type KitchenTicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KitchenTicket
     */
    select?: KitchenTicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KitchenTicket
     */
    omit?: KitchenTicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KitchenTicketInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    avatar: 'avatar',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const KitchenStationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    printer: 'printer',
    active: 'active',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KitchenStationScalarFieldEnum = (typeof KitchenStationScalarFieldEnum)[keyof typeof KitchenStationScalarFieldEnum]


  export const MenuCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    color: 'color',
    createdAt: 'createdAt'
  };

  export type MenuCategoryScalarFieldEnum = (typeof MenuCategoryScalarFieldEnum)[keyof typeof MenuCategoryScalarFieldEnum]


  export const MenuItemScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    sku: 'sku',
    available: 'available',
    posVisible: 'posVisible',
    popular: 'popular',
    prepTimeMinutes: 'prepTimeMinutes',
    image: 'image',
    categoryId: 'categoryId',
    stationId: 'stationId',
    modifiers: 'modifiers',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MenuItemScalarFieldEnum = (typeof MenuItemScalarFieldEnum)[keyof typeof MenuItemScalarFieldEnum]


  export const SupplierScalarFieldEnum: {
    id: 'id',
    name: 'name',
    contact: 'contact',
    email: 'email',
    phone: 'phone',
    rating: 'rating',
    createdAt: 'createdAt'
  };

  export type SupplierScalarFieldEnum = (typeof SupplierScalarFieldEnum)[keyof typeof SupplierScalarFieldEnum]


  export const InventoryItemScalarFieldEnum: {
    id: 'id',
    name: 'name',
    sku: 'sku',
    category: 'category',
    unit: 'unit',
    stock: 'stock',
    reorderLevel: 'reorderLevel',
    costPerUnit: 'costPerUnit',
    supplierId: 'supplierId',
    lastRestocked: 'lastRestocked',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InventoryItemScalarFieldEnum = (typeof InventoryItemScalarFieldEnum)[keyof typeof InventoryItemScalarFieldEnum]


  export const RecipeIngredientScalarFieldEnum: {
    id: 'id',
    menuItemId: 'menuItemId',
    inventoryItemId: 'inventoryItemId',
    quantity: 'quantity',
    unit: 'unit'
  };

  export type RecipeIngredientScalarFieldEnum = (typeof RecipeIngredientScalarFieldEnum)[keyof typeof RecipeIngredientScalarFieldEnum]


  export const InventoryMovementScalarFieldEnum: {
    id: 'id',
    inventoryItemId: 'inventoryItemId',
    delta: 'delta',
    reason: 'reason',
    orderId: 'orderId',
    createdAt: 'createdAt'
  };

  export type InventoryMovementScalarFieldEnum = (typeof InventoryMovementScalarFieldEnum)[keyof typeof InventoryMovementScalarFieldEnum]


  export const TableScalarFieldEnum: {
    id: 'id',
    name: 'name',
    capacity: 'capacity',
    occupancy: 'occupancy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TableScalarFieldEnum = (typeof TableScalarFieldEnum)[keyof typeof TableScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    number: 'number',
    status: 'status',
    channel: 'channel',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    tableId: 'tableId',
    staffId: 'staffId',
    subtotal: 'subtotal',
    tax: 'tax',
    tip: 'tip',
    discount: 'discount',
    total: 'total',
    payment: 'payment',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const OrderItemScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    menuItemId: 'menuItemId',
    name: 'name',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    modifiers: 'modifiers',
    note: 'note'
  };

  export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum]


  export const KitchenTicketScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    stationId: 'stationId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KitchenTicketScalarFieldEnum = (typeof KitchenTicketScalarFieldEnum)[keyof typeof KitchenTicketScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'OrderStatus'
   */
  export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>
    


  /**
   * Reference to a field of type 'OrderStatus[]'
   */
  export type ListEnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus[]'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>
    


  /**
   * Reference to a field of type 'TicketStatus'
   */
  export type EnumTicketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketStatus'>
    


  /**
   * Reference to a field of type 'TicketStatus[]'
   */
  export type ListEnumTicketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    orders?: OrderListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    orders?: OrderOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    orders?: OrderListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type KitchenStationWhereInput = {
    AND?: KitchenStationWhereInput | KitchenStationWhereInput[]
    OR?: KitchenStationWhereInput[]
    NOT?: KitchenStationWhereInput | KitchenStationWhereInput[]
    id?: StringFilter<"KitchenStation"> | string
    name?: StringFilter<"KitchenStation"> | string
    printer?: StringNullableFilter<"KitchenStation"> | string | null
    active?: BoolFilter<"KitchenStation"> | boolean
    color?: StringFilter<"KitchenStation"> | string
    createdAt?: DateTimeFilter<"KitchenStation"> | Date | string
    updatedAt?: DateTimeFilter<"KitchenStation"> | Date | string
    menuItems?: MenuItemListRelationFilter
    tickets?: KitchenTicketListRelationFilter
  }

  export type KitchenStationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    printer?: SortOrderInput | SortOrder
    active?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    menuItems?: MenuItemOrderByRelationAggregateInput
    tickets?: KitchenTicketOrderByRelationAggregateInput
  }

  export type KitchenStationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: KitchenStationWhereInput | KitchenStationWhereInput[]
    OR?: KitchenStationWhereInput[]
    NOT?: KitchenStationWhereInput | KitchenStationWhereInput[]
    printer?: StringNullableFilter<"KitchenStation"> | string | null
    active?: BoolFilter<"KitchenStation"> | boolean
    color?: StringFilter<"KitchenStation"> | string
    createdAt?: DateTimeFilter<"KitchenStation"> | Date | string
    updatedAt?: DateTimeFilter<"KitchenStation"> | Date | string
    menuItems?: MenuItemListRelationFilter
    tickets?: KitchenTicketListRelationFilter
  }, "id" | "name">

  export type KitchenStationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    printer?: SortOrderInput | SortOrder
    active?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KitchenStationCountOrderByAggregateInput
    _max?: KitchenStationMaxOrderByAggregateInput
    _min?: KitchenStationMinOrderByAggregateInput
  }

  export type KitchenStationScalarWhereWithAggregatesInput = {
    AND?: KitchenStationScalarWhereWithAggregatesInput | KitchenStationScalarWhereWithAggregatesInput[]
    OR?: KitchenStationScalarWhereWithAggregatesInput[]
    NOT?: KitchenStationScalarWhereWithAggregatesInput | KitchenStationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KitchenStation"> | string
    name?: StringWithAggregatesFilter<"KitchenStation"> | string
    printer?: StringNullableWithAggregatesFilter<"KitchenStation"> | string | null
    active?: BoolWithAggregatesFilter<"KitchenStation"> | boolean
    color?: StringWithAggregatesFilter<"KitchenStation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"KitchenStation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KitchenStation"> | Date | string
  }

  export type MenuCategoryWhereInput = {
    AND?: MenuCategoryWhereInput | MenuCategoryWhereInput[]
    OR?: MenuCategoryWhereInput[]
    NOT?: MenuCategoryWhereInput | MenuCategoryWhereInput[]
    id?: StringFilter<"MenuCategory"> | string
    name?: StringFilter<"MenuCategory"> | string
    slug?: StringFilter<"MenuCategory"> | string
    color?: StringFilter<"MenuCategory"> | string
    createdAt?: DateTimeFilter<"MenuCategory"> | Date | string
    items?: MenuItemListRelationFilter
  }

  export type MenuCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    items?: MenuItemOrderByRelationAggregateInput
  }

  export type MenuCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: MenuCategoryWhereInput | MenuCategoryWhereInput[]
    OR?: MenuCategoryWhereInput[]
    NOT?: MenuCategoryWhereInput | MenuCategoryWhereInput[]
    name?: StringFilter<"MenuCategory"> | string
    color?: StringFilter<"MenuCategory"> | string
    createdAt?: DateTimeFilter<"MenuCategory"> | Date | string
    items?: MenuItemListRelationFilter
  }, "id" | "slug">

  export type MenuCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    _count?: MenuCategoryCountOrderByAggregateInput
    _max?: MenuCategoryMaxOrderByAggregateInput
    _min?: MenuCategoryMinOrderByAggregateInput
  }

  export type MenuCategoryScalarWhereWithAggregatesInput = {
    AND?: MenuCategoryScalarWhereWithAggregatesInput | MenuCategoryScalarWhereWithAggregatesInput[]
    OR?: MenuCategoryScalarWhereWithAggregatesInput[]
    NOT?: MenuCategoryScalarWhereWithAggregatesInput | MenuCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MenuCategory"> | string
    name?: StringWithAggregatesFilter<"MenuCategory"> | string
    slug?: StringWithAggregatesFilter<"MenuCategory"> | string
    color?: StringWithAggregatesFilter<"MenuCategory"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MenuCategory"> | Date | string
  }

  export type MenuItemWhereInput = {
    AND?: MenuItemWhereInput | MenuItemWhereInput[]
    OR?: MenuItemWhereInput[]
    NOT?: MenuItemWhereInput | MenuItemWhereInput[]
    id?: StringFilter<"MenuItem"> | string
    name?: StringFilter<"MenuItem"> | string
    description?: StringNullableFilter<"MenuItem"> | string | null
    price?: DecimalFilter<"MenuItem"> | Decimal | DecimalJsLike | number | string
    sku?: StringNullableFilter<"MenuItem"> | string | null
    available?: BoolFilter<"MenuItem"> | boolean
    posVisible?: BoolFilter<"MenuItem"> | boolean
    popular?: BoolFilter<"MenuItem"> | boolean
    prepTimeMinutes?: IntNullableFilter<"MenuItem"> | number | null
    image?: StringNullableFilter<"MenuItem"> | string | null
    categoryId?: StringFilter<"MenuItem"> | string
    stationId?: StringFilter<"MenuItem"> | string
    modifiers?: JsonNullableFilter<"MenuItem">
    createdAt?: DateTimeFilter<"MenuItem"> | Date | string
    updatedAt?: DateTimeFilter<"MenuItem"> | Date | string
    category?: XOR<MenuCategoryScalarRelationFilter, MenuCategoryWhereInput>
    station?: XOR<KitchenStationScalarRelationFilter, KitchenStationWhereInput>
    recipe?: RecipeIngredientListRelationFilter
    orderItems?: OrderItemListRelationFilter
  }

  export type MenuItemOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    sku?: SortOrderInput | SortOrder
    available?: SortOrder
    posVisible?: SortOrder
    popular?: SortOrder
    prepTimeMinutes?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    stationId?: SortOrder
    modifiers?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: MenuCategoryOrderByWithRelationInput
    station?: KitchenStationOrderByWithRelationInput
    recipe?: RecipeIngredientOrderByRelationAggregateInput
    orderItems?: OrderItemOrderByRelationAggregateInput
  }

  export type MenuItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sku?: string
    AND?: MenuItemWhereInput | MenuItemWhereInput[]
    OR?: MenuItemWhereInput[]
    NOT?: MenuItemWhereInput | MenuItemWhereInput[]
    name?: StringFilter<"MenuItem"> | string
    description?: StringNullableFilter<"MenuItem"> | string | null
    price?: DecimalFilter<"MenuItem"> | Decimal | DecimalJsLike | number | string
    available?: BoolFilter<"MenuItem"> | boolean
    posVisible?: BoolFilter<"MenuItem"> | boolean
    popular?: BoolFilter<"MenuItem"> | boolean
    prepTimeMinutes?: IntNullableFilter<"MenuItem"> | number | null
    image?: StringNullableFilter<"MenuItem"> | string | null
    categoryId?: StringFilter<"MenuItem"> | string
    stationId?: StringFilter<"MenuItem"> | string
    modifiers?: JsonNullableFilter<"MenuItem">
    createdAt?: DateTimeFilter<"MenuItem"> | Date | string
    updatedAt?: DateTimeFilter<"MenuItem"> | Date | string
    category?: XOR<MenuCategoryScalarRelationFilter, MenuCategoryWhereInput>
    station?: XOR<KitchenStationScalarRelationFilter, KitchenStationWhereInput>
    recipe?: RecipeIngredientListRelationFilter
    orderItems?: OrderItemListRelationFilter
  }, "id" | "sku">

  export type MenuItemOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    sku?: SortOrderInput | SortOrder
    available?: SortOrder
    posVisible?: SortOrder
    popular?: SortOrder
    prepTimeMinutes?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    stationId?: SortOrder
    modifiers?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MenuItemCountOrderByAggregateInput
    _avg?: MenuItemAvgOrderByAggregateInput
    _max?: MenuItemMaxOrderByAggregateInput
    _min?: MenuItemMinOrderByAggregateInput
    _sum?: MenuItemSumOrderByAggregateInput
  }

  export type MenuItemScalarWhereWithAggregatesInput = {
    AND?: MenuItemScalarWhereWithAggregatesInput | MenuItemScalarWhereWithAggregatesInput[]
    OR?: MenuItemScalarWhereWithAggregatesInput[]
    NOT?: MenuItemScalarWhereWithAggregatesInput | MenuItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MenuItem"> | string
    name?: StringWithAggregatesFilter<"MenuItem"> | string
    description?: StringNullableWithAggregatesFilter<"MenuItem"> | string | null
    price?: DecimalWithAggregatesFilter<"MenuItem"> | Decimal | DecimalJsLike | number | string
    sku?: StringNullableWithAggregatesFilter<"MenuItem"> | string | null
    available?: BoolWithAggregatesFilter<"MenuItem"> | boolean
    posVisible?: BoolWithAggregatesFilter<"MenuItem"> | boolean
    popular?: BoolWithAggregatesFilter<"MenuItem"> | boolean
    prepTimeMinutes?: IntNullableWithAggregatesFilter<"MenuItem"> | number | null
    image?: StringNullableWithAggregatesFilter<"MenuItem"> | string | null
    categoryId?: StringWithAggregatesFilter<"MenuItem"> | string
    stationId?: StringWithAggregatesFilter<"MenuItem"> | string
    modifiers?: JsonNullableWithAggregatesFilter<"MenuItem">
    createdAt?: DateTimeWithAggregatesFilter<"MenuItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MenuItem"> | Date | string
  }

  export type SupplierWhereInput = {
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    id?: StringFilter<"Supplier"> | string
    name?: StringFilter<"Supplier"> | string
    contact?: StringNullableFilter<"Supplier"> | string | null
    email?: StringNullableFilter<"Supplier"> | string | null
    phone?: StringNullableFilter<"Supplier"> | string | null
    rating?: FloatFilter<"Supplier"> | number
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    inventoryItems?: InventoryItemListRelationFilter
  }

  export type SupplierOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    contact?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    inventoryItems?: InventoryItemOrderByRelationAggregateInput
  }

  export type SupplierWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    name?: StringFilter<"Supplier"> | string
    contact?: StringNullableFilter<"Supplier"> | string | null
    email?: StringNullableFilter<"Supplier"> | string | null
    phone?: StringNullableFilter<"Supplier"> | string | null
    rating?: FloatFilter<"Supplier"> | number
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    inventoryItems?: InventoryItemListRelationFilter
  }, "id">

  export type SupplierOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    contact?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    _count?: SupplierCountOrderByAggregateInput
    _avg?: SupplierAvgOrderByAggregateInput
    _max?: SupplierMaxOrderByAggregateInput
    _min?: SupplierMinOrderByAggregateInput
    _sum?: SupplierSumOrderByAggregateInput
  }

  export type SupplierScalarWhereWithAggregatesInput = {
    AND?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    OR?: SupplierScalarWhereWithAggregatesInput[]
    NOT?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Supplier"> | string
    name?: StringWithAggregatesFilter<"Supplier"> | string
    contact?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    email?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    rating?: FloatWithAggregatesFilter<"Supplier"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
  }

  export type InventoryItemWhereInput = {
    AND?: InventoryItemWhereInput | InventoryItemWhereInput[]
    OR?: InventoryItemWhereInput[]
    NOT?: InventoryItemWhereInput | InventoryItemWhereInput[]
    id?: StringFilter<"InventoryItem"> | string
    name?: StringFilter<"InventoryItem"> | string
    sku?: StringFilter<"InventoryItem"> | string
    category?: StringFilter<"InventoryItem"> | string
    unit?: StringFilter<"InventoryItem"> | string
    stock?: DecimalFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    supplierId?: StringNullableFilter<"InventoryItem"> | string | null
    lastRestocked?: DateTimeNullableFilter<"InventoryItem"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"InventoryItem"> | Date | string | null
    createdAt?: DateTimeFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryItem"> | Date | string
    supplier?: XOR<SupplierNullableScalarRelationFilter, SupplierWhereInput> | null
    recipes?: RecipeIngredientListRelationFilter
    movements?: InventoryMovementListRelationFilter
  }

  export type InventoryItemOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    unit?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    costPerUnit?: SortOrder
    supplierId?: SortOrderInput | SortOrder
    lastRestocked?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    supplier?: SupplierOrderByWithRelationInput
    recipes?: RecipeIngredientOrderByRelationAggregateInput
    movements?: InventoryMovementOrderByRelationAggregateInput
  }

  export type InventoryItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sku?: string
    AND?: InventoryItemWhereInput | InventoryItemWhereInput[]
    OR?: InventoryItemWhereInput[]
    NOT?: InventoryItemWhereInput | InventoryItemWhereInput[]
    name?: StringFilter<"InventoryItem"> | string
    category?: StringFilter<"InventoryItem"> | string
    unit?: StringFilter<"InventoryItem"> | string
    stock?: DecimalFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    supplierId?: StringNullableFilter<"InventoryItem"> | string | null
    lastRestocked?: DateTimeNullableFilter<"InventoryItem"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"InventoryItem"> | Date | string | null
    createdAt?: DateTimeFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryItem"> | Date | string
    supplier?: XOR<SupplierNullableScalarRelationFilter, SupplierWhereInput> | null
    recipes?: RecipeIngredientListRelationFilter
    movements?: InventoryMovementListRelationFilter
  }, "id" | "sku">

  export type InventoryItemOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    unit?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    costPerUnit?: SortOrder
    supplierId?: SortOrderInput | SortOrder
    lastRestocked?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InventoryItemCountOrderByAggregateInput
    _avg?: InventoryItemAvgOrderByAggregateInput
    _max?: InventoryItemMaxOrderByAggregateInput
    _min?: InventoryItemMinOrderByAggregateInput
    _sum?: InventoryItemSumOrderByAggregateInput
  }

  export type InventoryItemScalarWhereWithAggregatesInput = {
    AND?: InventoryItemScalarWhereWithAggregatesInput | InventoryItemScalarWhereWithAggregatesInput[]
    OR?: InventoryItemScalarWhereWithAggregatesInput[]
    NOT?: InventoryItemScalarWhereWithAggregatesInput | InventoryItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryItem"> | string
    name?: StringWithAggregatesFilter<"InventoryItem"> | string
    sku?: StringWithAggregatesFilter<"InventoryItem"> | string
    category?: StringWithAggregatesFilter<"InventoryItem"> | string
    unit?: StringWithAggregatesFilter<"InventoryItem"> | string
    stock?: DecimalWithAggregatesFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalWithAggregatesFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalWithAggregatesFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    supplierId?: StringNullableWithAggregatesFilter<"InventoryItem"> | string | null
    lastRestocked?: DateTimeNullableWithAggregatesFilter<"InventoryItem"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"InventoryItem"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string
  }

  export type RecipeIngredientWhereInput = {
    AND?: RecipeIngredientWhereInput | RecipeIngredientWhereInput[]
    OR?: RecipeIngredientWhereInput[]
    NOT?: RecipeIngredientWhereInput | RecipeIngredientWhereInput[]
    id?: StringFilter<"RecipeIngredient"> | string
    menuItemId?: StringFilter<"RecipeIngredient"> | string
    inventoryItemId?: StringFilter<"RecipeIngredient"> | string
    quantity?: DecimalFilter<"RecipeIngredient"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"RecipeIngredient"> | string
    menuItem?: XOR<MenuItemScalarRelationFilter, MenuItemWhereInput>
    inventoryItem?: XOR<InventoryItemScalarRelationFilter, InventoryItemWhereInput>
  }

  export type RecipeIngredientOrderByWithRelationInput = {
    id?: SortOrder
    menuItemId?: SortOrder
    inventoryItemId?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    menuItem?: MenuItemOrderByWithRelationInput
    inventoryItem?: InventoryItemOrderByWithRelationInput
  }

  export type RecipeIngredientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    menuItemId_inventoryItemId?: RecipeIngredientMenuItemIdInventoryItemIdCompoundUniqueInput
    AND?: RecipeIngredientWhereInput | RecipeIngredientWhereInput[]
    OR?: RecipeIngredientWhereInput[]
    NOT?: RecipeIngredientWhereInput | RecipeIngredientWhereInput[]
    menuItemId?: StringFilter<"RecipeIngredient"> | string
    inventoryItemId?: StringFilter<"RecipeIngredient"> | string
    quantity?: DecimalFilter<"RecipeIngredient"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"RecipeIngredient"> | string
    menuItem?: XOR<MenuItemScalarRelationFilter, MenuItemWhereInput>
    inventoryItem?: XOR<InventoryItemScalarRelationFilter, InventoryItemWhereInput>
  }, "id" | "menuItemId_inventoryItemId">

  export type RecipeIngredientOrderByWithAggregationInput = {
    id?: SortOrder
    menuItemId?: SortOrder
    inventoryItemId?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
    _count?: RecipeIngredientCountOrderByAggregateInput
    _avg?: RecipeIngredientAvgOrderByAggregateInput
    _max?: RecipeIngredientMaxOrderByAggregateInput
    _min?: RecipeIngredientMinOrderByAggregateInput
    _sum?: RecipeIngredientSumOrderByAggregateInput
  }

  export type RecipeIngredientScalarWhereWithAggregatesInput = {
    AND?: RecipeIngredientScalarWhereWithAggregatesInput | RecipeIngredientScalarWhereWithAggregatesInput[]
    OR?: RecipeIngredientScalarWhereWithAggregatesInput[]
    NOT?: RecipeIngredientScalarWhereWithAggregatesInput | RecipeIngredientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RecipeIngredient"> | string
    menuItemId?: StringWithAggregatesFilter<"RecipeIngredient"> | string
    inventoryItemId?: StringWithAggregatesFilter<"RecipeIngredient"> | string
    quantity?: DecimalWithAggregatesFilter<"RecipeIngredient"> | Decimal | DecimalJsLike | number | string
    unit?: StringWithAggregatesFilter<"RecipeIngredient"> | string
  }

  export type InventoryMovementWhereInput = {
    AND?: InventoryMovementWhereInput | InventoryMovementWhereInput[]
    OR?: InventoryMovementWhereInput[]
    NOT?: InventoryMovementWhereInput | InventoryMovementWhereInput[]
    id?: StringFilter<"InventoryMovement"> | string
    inventoryItemId?: StringFilter<"InventoryMovement"> | string
    delta?: DecimalFilter<"InventoryMovement"> | Decimal | DecimalJsLike | number | string
    reason?: StringFilter<"InventoryMovement"> | string
    orderId?: StringNullableFilter<"InventoryMovement"> | string | null
    createdAt?: DateTimeFilter<"InventoryMovement"> | Date | string
    inventoryItem?: XOR<InventoryItemScalarRelationFilter, InventoryItemWhereInput>
  }

  export type InventoryMovementOrderByWithRelationInput = {
    id?: SortOrder
    inventoryItemId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    orderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    inventoryItem?: InventoryItemOrderByWithRelationInput
  }

  export type InventoryMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InventoryMovementWhereInput | InventoryMovementWhereInput[]
    OR?: InventoryMovementWhereInput[]
    NOT?: InventoryMovementWhereInput | InventoryMovementWhereInput[]
    inventoryItemId?: StringFilter<"InventoryMovement"> | string
    delta?: DecimalFilter<"InventoryMovement"> | Decimal | DecimalJsLike | number | string
    reason?: StringFilter<"InventoryMovement"> | string
    orderId?: StringNullableFilter<"InventoryMovement"> | string | null
    createdAt?: DateTimeFilter<"InventoryMovement"> | Date | string
    inventoryItem?: XOR<InventoryItemScalarRelationFilter, InventoryItemWhereInput>
  }, "id">

  export type InventoryMovementOrderByWithAggregationInput = {
    id?: SortOrder
    inventoryItemId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    orderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InventoryMovementCountOrderByAggregateInput
    _avg?: InventoryMovementAvgOrderByAggregateInput
    _max?: InventoryMovementMaxOrderByAggregateInput
    _min?: InventoryMovementMinOrderByAggregateInput
    _sum?: InventoryMovementSumOrderByAggregateInput
  }

  export type InventoryMovementScalarWhereWithAggregatesInput = {
    AND?: InventoryMovementScalarWhereWithAggregatesInput | InventoryMovementScalarWhereWithAggregatesInput[]
    OR?: InventoryMovementScalarWhereWithAggregatesInput[]
    NOT?: InventoryMovementScalarWhereWithAggregatesInput | InventoryMovementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryMovement"> | string
    inventoryItemId?: StringWithAggregatesFilter<"InventoryMovement"> | string
    delta?: DecimalWithAggregatesFilter<"InventoryMovement"> | Decimal | DecimalJsLike | number | string
    reason?: StringWithAggregatesFilter<"InventoryMovement"> | string
    orderId?: StringNullableWithAggregatesFilter<"InventoryMovement"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InventoryMovement"> | Date | string
  }

  export type TableWhereInput = {
    AND?: TableWhereInput | TableWhereInput[]
    OR?: TableWhereInput[]
    NOT?: TableWhereInput | TableWhereInput[]
    id?: StringFilter<"Table"> | string
    name?: StringFilter<"Table"> | string
    capacity?: IntFilter<"Table"> | number
    occupancy?: IntFilter<"Table"> | number
    createdAt?: DateTimeFilter<"Table"> | Date | string
    updatedAt?: DateTimeFilter<"Table"> | Date | string
    orders?: OrderListRelationFilter
  }

  export type TableOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    occupancy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    orders?: OrderOrderByRelationAggregateInput
  }

  export type TableWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: TableWhereInput | TableWhereInput[]
    OR?: TableWhereInput[]
    NOT?: TableWhereInput | TableWhereInput[]
    capacity?: IntFilter<"Table"> | number
    occupancy?: IntFilter<"Table"> | number
    createdAt?: DateTimeFilter<"Table"> | Date | string
    updatedAt?: DateTimeFilter<"Table"> | Date | string
    orders?: OrderListRelationFilter
  }, "id" | "name">

  export type TableOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    occupancy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TableCountOrderByAggregateInput
    _avg?: TableAvgOrderByAggregateInput
    _max?: TableMaxOrderByAggregateInput
    _min?: TableMinOrderByAggregateInput
    _sum?: TableSumOrderByAggregateInput
  }

  export type TableScalarWhereWithAggregatesInput = {
    AND?: TableScalarWhereWithAggregatesInput | TableScalarWhereWithAggregatesInput[]
    OR?: TableScalarWhereWithAggregatesInput[]
    NOT?: TableScalarWhereWithAggregatesInput | TableScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Table"> | string
    name?: StringWithAggregatesFilter<"Table"> | string
    capacity?: IntWithAggregatesFilter<"Table"> | number
    occupancy?: IntWithAggregatesFilter<"Table"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Table"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Table"> | Date | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    number?: StringFilter<"Order"> | string
    status?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    channel?: StringFilter<"Order"> | string
    customerName?: StringNullableFilter<"Order"> | string | null
    customerPhone?: StringNullableFilter<"Order"> | string | null
    tableId?: StringNullableFilter<"Order"> | string | null
    staffId?: StringNullableFilter<"Order"> | string | null
    subtotal?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    tip?: DecimalNullableFilter<"Order"> | Decimal | DecimalJsLike | number | string | null
    discount?: DecimalNullableFilter<"Order"> | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFilter<"Order"> | $Enums.PaymentMethod
    notes?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    table?: XOR<TableNullableScalarRelationFilter, TableWhereInput> | null
    staff?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    items?: OrderItemListRelationFilter
    tickets?: KitchenTicketListRelationFilter
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    number?: SortOrder
    status?: SortOrder
    channel?: SortOrder
    customerName?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    tableId?: SortOrderInput | SortOrder
    staffId?: SortOrderInput | SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    tip?: SortOrderInput | SortOrder
    discount?: SortOrderInput | SortOrder
    total?: SortOrder
    payment?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    table?: TableOrderByWithRelationInput
    staff?: UserOrderByWithRelationInput
    items?: OrderItemOrderByRelationAggregateInput
    tickets?: KitchenTicketOrderByRelationAggregateInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    number?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    status?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    channel?: StringFilter<"Order"> | string
    customerName?: StringNullableFilter<"Order"> | string | null
    customerPhone?: StringNullableFilter<"Order"> | string | null
    tableId?: StringNullableFilter<"Order"> | string | null
    staffId?: StringNullableFilter<"Order"> | string | null
    subtotal?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    tip?: DecimalNullableFilter<"Order"> | Decimal | DecimalJsLike | number | string | null
    discount?: DecimalNullableFilter<"Order"> | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFilter<"Order"> | $Enums.PaymentMethod
    notes?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    table?: XOR<TableNullableScalarRelationFilter, TableWhereInput> | null
    staff?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    items?: OrderItemListRelationFilter
    tickets?: KitchenTicketListRelationFilter
  }, "id" | "number">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    number?: SortOrder
    status?: SortOrder
    channel?: SortOrder
    customerName?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    tableId?: SortOrderInput | SortOrder
    staffId?: SortOrderInput | SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    tip?: SortOrderInput | SortOrder
    discount?: SortOrderInput | SortOrder
    total?: SortOrder
    payment?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    number?: StringWithAggregatesFilter<"Order"> | string
    status?: EnumOrderStatusWithAggregatesFilter<"Order"> | $Enums.OrderStatus
    channel?: StringWithAggregatesFilter<"Order"> | string
    customerName?: StringNullableWithAggregatesFilter<"Order"> | string | null
    customerPhone?: StringNullableWithAggregatesFilter<"Order"> | string | null
    tableId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    staffId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    subtotal?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    tip?: DecimalNullableWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string | null
    discount?: DecimalNullableWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string | null
    total?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodWithAggregatesFilter<"Order"> | $Enums.PaymentMethod
    notes?: StringNullableWithAggregatesFilter<"Order"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
  }

  export type OrderItemWhereInput = {
    AND?: OrderItemWhereInput | OrderItemWhereInput[]
    OR?: OrderItemWhereInput[]
    NOT?: OrderItemWhereInput | OrderItemWhereInput[]
    id?: StringFilter<"OrderItem"> | string
    orderId?: StringFilter<"OrderItem"> | string
    menuItemId?: StringFilter<"OrderItem"> | string
    name?: StringFilter<"OrderItem"> | string
    quantity?: IntFilter<"OrderItem"> | number
    unitPrice?: DecimalFilter<"OrderItem"> | Decimal | DecimalJsLike | number | string
    modifiers?: JsonNullableFilter<"OrderItem">
    note?: StringNullableFilter<"OrderItem"> | string | null
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
    menuItem?: XOR<MenuItemScalarRelationFilter, MenuItemWhereInput>
  }

  export type OrderItemOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    menuItemId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    modifiers?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    order?: OrderOrderByWithRelationInput
    menuItem?: MenuItemOrderByWithRelationInput
  }

  export type OrderItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderItemWhereInput | OrderItemWhereInput[]
    OR?: OrderItemWhereInput[]
    NOT?: OrderItemWhereInput | OrderItemWhereInput[]
    orderId?: StringFilter<"OrderItem"> | string
    menuItemId?: StringFilter<"OrderItem"> | string
    name?: StringFilter<"OrderItem"> | string
    quantity?: IntFilter<"OrderItem"> | number
    unitPrice?: DecimalFilter<"OrderItem"> | Decimal | DecimalJsLike | number | string
    modifiers?: JsonNullableFilter<"OrderItem">
    note?: StringNullableFilter<"OrderItem"> | string | null
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
    menuItem?: XOR<MenuItemScalarRelationFilter, MenuItemWhereInput>
  }, "id">

  export type OrderItemOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    menuItemId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    modifiers?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    _count?: OrderItemCountOrderByAggregateInput
    _avg?: OrderItemAvgOrderByAggregateInput
    _max?: OrderItemMaxOrderByAggregateInput
    _min?: OrderItemMinOrderByAggregateInput
    _sum?: OrderItemSumOrderByAggregateInput
  }

  export type OrderItemScalarWhereWithAggregatesInput = {
    AND?: OrderItemScalarWhereWithAggregatesInput | OrderItemScalarWhereWithAggregatesInput[]
    OR?: OrderItemScalarWhereWithAggregatesInput[]
    NOT?: OrderItemScalarWhereWithAggregatesInput | OrderItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OrderItem"> | string
    orderId?: StringWithAggregatesFilter<"OrderItem"> | string
    menuItemId?: StringWithAggregatesFilter<"OrderItem"> | string
    name?: StringWithAggregatesFilter<"OrderItem"> | string
    quantity?: IntWithAggregatesFilter<"OrderItem"> | number
    unitPrice?: DecimalWithAggregatesFilter<"OrderItem"> | Decimal | DecimalJsLike | number | string
    modifiers?: JsonNullableWithAggregatesFilter<"OrderItem">
    note?: StringNullableWithAggregatesFilter<"OrderItem"> | string | null
  }

  export type KitchenTicketWhereInput = {
    AND?: KitchenTicketWhereInput | KitchenTicketWhereInput[]
    OR?: KitchenTicketWhereInput[]
    NOT?: KitchenTicketWhereInput | KitchenTicketWhereInput[]
    id?: StringFilter<"KitchenTicket"> | string
    orderId?: StringFilter<"KitchenTicket"> | string
    stationId?: StringFilter<"KitchenTicket"> | string
    status?: EnumTicketStatusFilter<"KitchenTicket"> | $Enums.TicketStatus
    createdAt?: DateTimeFilter<"KitchenTicket"> | Date | string
    updatedAt?: DateTimeFilter<"KitchenTicket"> | Date | string
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
    station?: XOR<KitchenStationScalarRelationFilter, KitchenStationWhereInput>
  }

  export type KitchenTicketOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    stationId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    order?: OrderOrderByWithRelationInput
    station?: KitchenStationOrderByWithRelationInput
  }

  export type KitchenTicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderId_stationId?: KitchenTicketOrderIdStationIdCompoundUniqueInput
    AND?: KitchenTicketWhereInput | KitchenTicketWhereInput[]
    OR?: KitchenTicketWhereInput[]
    NOT?: KitchenTicketWhereInput | KitchenTicketWhereInput[]
    orderId?: StringFilter<"KitchenTicket"> | string
    stationId?: StringFilter<"KitchenTicket"> | string
    status?: EnumTicketStatusFilter<"KitchenTicket"> | $Enums.TicketStatus
    createdAt?: DateTimeFilter<"KitchenTicket"> | Date | string
    updatedAt?: DateTimeFilter<"KitchenTicket"> | Date | string
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
    station?: XOR<KitchenStationScalarRelationFilter, KitchenStationWhereInput>
  }, "id" | "orderId_stationId">

  export type KitchenTicketOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    stationId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KitchenTicketCountOrderByAggregateInput
    _max?: KitchenTicketMaxOrderByAggregateInput
    _min?: KitchenTicketMinOrderByAggregateInput
  }

  export type KitchenTicketScalarWhereWithAggregatesInput = {
    AND?: KitchenTicketScalarWhereWithAggregatesInput | KitchenTicketScalarWhereWithAggregatesInput[]
    OR?: KitchenTicketScalarWhereWithAggregatesInput[]
    NOT?: KitchenTicketScalarWhereWithAggregatesInput | KitchenTicketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KitchenTicket"> | string
    orderId?: StringWithAggregatesFilter<"KitchenTicket"> | string
    stationId?: StringWithAggregatesFilter<"KitchenTicket"> | string
    status?: EnumTicketStatusWithAggregatesFilter<"KitchenTicket"> | $Enums.TicketStatus
    createdAt?: DateTimeWithAggregatesFilter<"KitchenTicket"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KitchenTicket"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    orders?: OrderCreateNestedManyWithoutStaffInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    orders?: OrderUncheckedCreateNestedManyWithoutStaffInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    orders?: OrderUpdateManyWithoutStaffNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    orders?: OrderUncheckedUpdateManyWithoutStaffNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    expiresAt: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    userId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    userId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KitchenStationCreateInput = {
    id?: string
    name: string
    printer?: string | null
    active?: boolean
    color?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    menuItems?: MenuItemCreateNestedManyWithoutStationInput
    tickets?: KitchenTicketCreateNestedManyWithoutStationInput
  }

  export type KitchenStationUncheckedCreateInput = {
    id?: string
    name: string
    printer?: string | null
    active?: boolean
    color?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    menuItems?: MenuItemUncheckedCreateNestedManyWithoutStationInput
    tickets?: KitchenTicketUncheckedCreateNestedManyWithoutStationInput
  }

  export type KitchenStationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    printer?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    menuItems?: MenuItemUpdateManyWithoutStationNestedInput
    tickets?: KitchenTicketUpdateManyWithoutStationNestedInput
  }

  export type KitchenStationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    printer?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    menuItems?: MenuItemUncheckedUpdateManyWithoutStationNestedInput
    tickets?: KitchenTicketUncheckedUpdateManyWithoutStationNestedInput
  }

  export type KitchenStationCreateManyInput = {
    id?: string
    name: string
    printer?: string | null
    active?: boolean
    color?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KitchenStationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    printer?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KitchenStationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    printer?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MenuCategoryCreateInput = {
    id?: string
    name: string
    slug: string
    color: string
    createdAt?: Date | string
    items?: MenuItemCreateNestedManyWithoutCategoryInput
  }

  export type MenuCategoryUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    color: string
    createdAt?: Date | string
    items?: MenuItemUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type MenuCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: MenuItemUpdateManyWithoutCategoryNestedInput
  }

  export type MenuCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: MenuItemUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type MenuCategoryCreateManyInput = {
    id?: string
    name: string
    slug: string
    color: string
    createdAt?: Date | string
  }

  export type MenuCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MenuCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MenuItemCreateInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    category: MenuCategoryCreateNestedOneWithoutItemsInput
    station: KitchenStationCreateNestedOneWithoutMenuItemsInput
    recipe?: RecipeIngredientCreateNestedManyWithoutMenuItemInput
    orderItems?: OrderItemCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    categoryId: string
    stationId: string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    recipe?: RecipeIngredientUncheckedCreateNestedManyWithoutMenuItemInput
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: MenuCategoryUpdateOneRequiredWithoutItemsNestedInput
    station?: KitchenStationUpdateOneRequiredWithoutMenuItemsNestedInput
    recipe?: RecipeIngredientUpdateManyWithoutMenuItemNestedInput
    orderItems?: OrderItemUpdateManyWithoutMenuItemNestedInput
  }

  export type MenuItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipe?: RecipeIngredientUncheckedUpdateManyWithoutMenuItemNestedInput
    orderItems?: OrderItemUncheckedUpdateManyWithoutMenuItemNestedInput
  }

  export type MenuItemCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    categoryId: string
    stationId: string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MenuItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MenuItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierCreateInput = {
    id?: string
    name: string
    contact?: string | null
    email?: string | null
    phone?: string | null
    rating?: number
    createdAt?: Date | string
    inventoryItems?: InventoryItemCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUncheckedCreateInput = {
    id?: string
    name: string
    contact?: string | null
    email?: string | null
    phone?: string | null
    rating?: number
    createdAt?: Date | string
    inventoryItems?: InventoryItemUncheckedCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryItems?: InventoryItemUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryItems?: InventoryItemUncheckedUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierCreateManyInput = {
    id?: string
    name: string
    contact?: string | null
    email?: string | null
    phone?: string | null
    rating?: number
    createdAt?: Date | string
  }

  export type SupplierUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemCreateInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier?: SupplierCreateNestedOneWithoutInventoryItemsInput
    recipes?: RecipeIngredientCreateNestedManyWithoutInventoryItemInput
    movements?: InventoryMovementCreateNestedManyWithoutInventoryItemInput
  }

  export type InventoryItemUncheckedCreateInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    supplierId?: string | null
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeIngredientUncheckedCreateNestedManyWithoutInventoryItemInput
    movements?: InventoryMovementUncheckedCreateNestedManyWithoutInventoryItemInput
  }

  export type InventoryItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneWithoutInventoryItemsNestedInput
    recipes?: RecipeIngredientUpdateManyWithoutInventoryItemNestedInput
    movements?: InventoryMovementUpdateManyWithoutInventoryItemNestedInput
  }

  export type InventoryItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    supplierId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeIngredientUncheckedUpdateManyWithoutInventoryItemNestedInput
    movements?: InventoryMovementUncheckedUpdateManyWithoutInventoryItemNestedInput
  }

  export type InventoryItemCreateManyInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    supplierId?: string | null
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    supplierId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipeIngredientCreateInput = {
    id?: string
    quantity: Decimal | DecimalJsLike | number | string
    unit: string
    menuItem: MenuItemCreateNestedOneWithoutRecipeInput
    inventoryItem: InventoryItemCreateNestedOneWithoutRecipesInput
  }

  export type RecipeIngredientUncheckedCreateInput = {
    id?: string
    menuItemId: string
    inventoryItemId: string
    quantity: Decimal | DecimalJsLike | number | string
    unit: string
  }

  export type RecipeIngredientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    menuItem?: MenuItemUpdateOneRequiredWithoutRecipeNestedInput
    inventoryItem?: InventoryItemUpdateOneRequiredWithoutRecipesNestedInput
  }

  export type RecipeIngredientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    menuItemId?: StringFieldUpdateOperationsInput | string
    inventoryItemId?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
  }

  export type RecipeIngredientCreateManyInput = {
    id?: string
    menuItemId: string
    inventoryItemId: string
    quantity: Decimal | DecimalJsLike | number | string
    unit: string
  }

  export type RecipeIngredientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
  }

  export type RecipeIngredientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    menuItemId?: StringFieldUpdateOperationsInput | string
    inventoryItemId?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
  }

  export type InventoryMovementCreateInput = {
    id?: string
    delta: Decimal | DecimalJsLike | number | string
    reason: string
    orderId?: string | null
    createdAt?: Date | string
    inventoryItem: InventoryItemCreateNestedOneWithoutMovementsInput
  }

  export type InventoryMovementUncheckedCreateInput = {
    id?: string
    inventoryItemId: string
    delta: Decimal | DecimalJsLike | number | string
    reason: string
    orderId?: string | null
    createdAt?: Date | string
  }

  export type InventoryMovementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    delta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryItem?: InventoryItemUpdateOneRequiredWithoutMovementsNestedInput
  }

  export type InventoryMovementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryItemId?: StringFieldUpdateOperationsInput | string
    delta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryMovementCreateManyInput = {
    id?: string
    inventoryItemId: string
    delta: Decimal | DecimalJsLike | number | string
    reason: string
    orderId?: string | null
    createdAt?: Date | string
  }

  export type InventoryMovementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    delta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryMovementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryItemId?: StringFieldUpdateOperationsInput | string
    delta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TableCreateInput = {
    id?: string
    name: string
    capacity: number
    occupancy?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: OrderCreateNestedManyWithoutTableInput
  }

  export type TableUncheckedCreateInput = {
    id?: string
    name: string
    capacity: number
    occupancy?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: OrderUncheckedCreateNestedManyWithoutTableInput
  }

  export type TableUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    occupancy?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUpdateManyWithoutTableNestedInput
  }

  export type TableUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    occupancy?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUncheckedUpdateManyWithoutTableNestedInput
  }

  export type TableCreateManyInput = {
    id?: string
    name: string
    capacity: number
    occupancy?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TableUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    occupancy?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TableUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    occupancy?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    table?: TableCreateNestedOneWithoutOrdersInput
    staff?: UserCreateNestedOneWithoutOrdersInput
    items?: OrderItemCreateNestedManyWithoutOrderInput
    tickets?: KitchenTicketCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    tableId?: string | null
    staffId?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
    tickets?: KitchenTicketUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    table?: TableUpdateOneWithoutOrdersNestedInput
    staff?: UserUpdateOneWithoutOrdersNestedInput
    items?: OrderItemUpdateManyWithoutOrderNestedInput
    tickets?: KitchenTicketUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
    tickets?: KitchenTicketUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderCreateManyInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    tableId?: string | null
    staffId?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderItemCreateInput = {
    id?: string
    name: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: string | null
    order: OrderCreateNestedOneWithoutItemsInput
    menuItem: MenuItemCreateNestedOneWithoutOrderItemsInput
  }

  export type OrderItemUncheckedCreateInput = {
    id?: string
    orderId: string
    menuItemId: string
    name: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: string | null
  }

  export type OrderItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
    order?: OrderUpdateOneRequiredWithoutItemsNestedInput
    menuItem?: MenuItemUpdateOneRequiredWithoutOrderItemsNestedInput
  }

  export type OrderItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    menuItemId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderItemCreateManyInput = {
    id?: string
    orderId: string
    menuItemId: string
    name: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: string | null
  }

  export type OrderItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    menuItemId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KitchenTicketCreateInput = {
    id?: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    order: OrderCreateNestedOneWithoutTicketsInput
    station: KitchenStationCreateNestedOneWithoutTicketsInput
  }

  export type KitchenTicketUncheckedCreateInput = {
    id?: string
    orderId: string
    stationId: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KitchenTicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutTicketsNestedInput
    station?: KitchenStationUpdateOneRequiredWithoutTicketsNestedInput
  }

  export type KitchenTicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KitchenTicketCreateManyInput = {
    id?: string
    orderId: string
    stationId: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KitchenTicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KitchenTicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type OrderListRelationFilter = {
    every?: OrderWhereInput
    some?: OrderWhereInput
    none?: OrderWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type MenuItemListRelationFilter = {
    every?: MenuItemWhereInput
    some?: MenuItemWhereInput
    none?: MenuItemWhereInput
  }

  export type KitchenTicketListRelationFilter = {
    every?: KitchenTicketWhereInput
    some?: KitchenTicketWhereInput
    none?: KitchenTicketWhereInput
  }

  export type MenuItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KitchenTicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KitchenStationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    printer?: SortOrder
    active?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KitchenStationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    printer?: SortOrder
    active?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KitchenStationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    printer?: SortOrder
    active?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type MenuCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
  }

  export type MenuCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
  }

  export type MenuCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type MenuCategoryScalarRelationFilter = {
    is?: MenuCategoryWhereInput
    isNot?: MenuCategoryWhereInput
  }

  export type KitchenStationScalarRelationFilter = {
    is?: KitchenStationWhereInput
    isNot?: KitchenStationWhereInput
  }

  export type RecipeIngredientListRelationFilter = {
    every?: RecipeIngredientWhereInput
    some?: RecipeIngredientWhereInput
    none?: RecipeIngredientWhereInput
  }

  export type OrderItemListRelationFilter = {
    every?: OrderItemWhereInput
    some?: OrderItemWhereInput
    none?: OrderItemWhereInput
  }

  export type RecipeIngredientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MenuItemCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    sku?: SortOrder
    available?: SortOrder
    posVisible?: SortOrder
    popular?: SortOrder
    prepTimeMinutes?: SortOrder
    image?: SortOrder
    categoryId?: SortOrder
    stationId?: SortOrder
    modifiers?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MenuItemAvgOrderByAggregateInput = {
    price?: SortOrder
    prepTimeMinutes?: SortOrder
  }

  export type MenuItemMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    sku?: SortOrder
    available?: SortOrder
    posVisible?: SortOrder
    popular?: SortOrder
    prepTimeMinutes?: SortOrder
    image?: SortOrder
    categoryId?: SortOrder
    stationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MenuItemMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    sku?: SortOrder
    available?: SortOrder
    posVisible?: SortOrder
    popular?: SortOrder
    prepTimeMinutes?: SortOrder
    image?: SortOrder
    categoryId?: SortOrder
    stationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MenuItemSumOrderByAggregateInput = {
    price?: SortOrder
    prepTimeMinutes?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type InventoryItemListRelationFilter = {
    every?: InventoryItemWhereInput
    some?: InventoryItemWhereInput
    none?: InventoryItemWhereInput
  }

  export type InventoryItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SupplierCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    contact?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
  }

  export type SupplierAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type SupplierMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    contact?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
  }

  export type SupplierMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    contact?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
  }

  export type SupplierSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SupplierNullableScalarRelationFilter = {
    is?: SupplierWhereInput | null
    isNot?: SupplierWhereInput | null
  }

  export type InventoryMovementListRelationFilter = {
    every?: InventoryMovementWhereInput
    some?: InventoryMovementWhereInput
    none?: InventoryMovementWhereInput
  }

  export type InventoryMovementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventoryItemCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    unit?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    costPerUnit?: SortOrder
    supplierId?: SortOrder
    lastRestocked?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryItemAvgOrderByAggregateInput = {
    stock?: SortOrder
    reorderLevel?: SortOrder
    costPerUnit?: SortOrder
  }

  export type InventoryItemMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    unit?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    costPerUnit?: SortOrder
    supplierId?: SortOrder
    lastRestocked?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryItemMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    unit?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    costPerUnit?: SortOrder
    supplierId?: SortOrder
    lastRestocked?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryItemSumOrderByAggregateInput = {
    stock?: SortOrder
    reorderLevel?: SortOrder
    costPerUnit?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type MenuItemScalarRelationFilter = {
    is?: MenuItemWhereInput
    isNot?: MenuItemWhereInput
  }

  export type InventoryItemScalarRelationFilter = {
    is?: InventoryItemWhereInput
    isNot?: InventoryItemWhereInput
  }

  export type RecipeIngredientMenuItemIdInventoryItemIdCompoundUniqueInput = {
    menuItemId: string
    inventoryItemId: string
  }

  export type RecipeIngredientCountOrderByAggregateInput = {
    id?: SortOrder
    menuItemId?: SortOrder
    inventoryItemId?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
  }

  export type RecipeIngredientAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type RecipeIngredientMaxOrderByAggregateInput = {
    id?: SortOrder
    menuItemId?: SortOrder
    inventoryItemId?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
  }

  export type RecipeIngredientMinOrderByAggregateInput = {
    id?: SortOrder
    menuItemId?: SortOrder
    inventoryItemId?: SortOrder
    quantity?: SortOrder
    unit?: SortOrder
  }

  export type RecipeIngredientSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type InventoryMovementCountOrderByAggregateInput = {
    id?: SortOrder
    inventoryItemId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryMovementAvgOrderByAggregateInput = {
    delta?: SortOrder
  }

  export type InventoryMovementMaxOrderByAggregateInput = {
    id?: SortOrder
    inventoryItemId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryMovementMinOrderByAggregateInput = {
    id?: SortOrder
    inventoryItemId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryMovementSumOrderByAggregateInput = {
    delta?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type TableCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    occupancy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TableAvgOrderByAggregateInput = {
    capacity?: SortOrder
    occupancy?: SortOrder
  }

  export type TableMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    occupancy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TableMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    occupancy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TableSumOrderByAggregateInput = {
    capacity?: SortOrder
    occupancy?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type TableNullableScalarRelationFilter = {
    is?: TableWhereInput | null
    isNot?: TableWhereInput | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    number?: SortOrder
    status?: SortOrder
    channel?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    tableId?: SortOrder
    staffId?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    tip?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    payment?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    subtotal?: SortOrder
    tax?: SortOrder
    tip?: SortOrder
    discount?: SortOrder
    total?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    number?: SortOrder
    status?: SortOrder
    channel?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    tableId?: SortOrder
    staffId?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    tip?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    payment?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    number?: SortOrder
    status?: SortOrder
    channel?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    tableId?: SortOrder
    staffId?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    tip?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    payment?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    subtotal?: SortOrder
    tax?: SortOrder
    tip?: SortOrder
    discount?: SortOrder
    total?: SortOrder
  }

  export type EnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type OrderScalarRelationFilter = {
    is?: OrderWhereInput
    isNot?: OrderWhereInput
  }

  export type OrderItemCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    menuItemId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    modifiers?: SortOrder
    note?: SortOrder
  }

  export type OrderItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
  }

  export type OrderItemMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    menuItemId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    note?: SortOrder
  }

  export type OrderItemMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    menuItemId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    note?: SortOrder
  }

  export type OrderItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
  }

  export type EnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type KitchenTicketOrderIdStationIdCompoundUniqueInput = {
    orderId: string
    stationId: string
  }

  export type KitchenTicketCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    stationId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KitchenTicketMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    stationId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KitchenTicketMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    stationId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type OrderCreateNestedManyWithoutStaffInput = {
    create?: XOR<OrderCreateWithoutStaffInput, OrderUncheckedCreateWithoutStaffInput> | OrderCreateWithoutStaffInput[] | OrderUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutStaffInput | OrderCreateOrConnectWithoutStaffInput[]
    createMany?: OrderCreateManyStaffInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutStaffInput = {
    create?: XOR<OrderCreateWithoutStaffInput, OrderUncheckedCreateWithoutStaffInput> | OrderCreateWithoutStaffInput[] | OrderUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutStaffInput | OrderCreateOrConnectWithoutStaffInput[]
    createMany?: OrderCreateManyStaffInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type OrderUpdateManyWithoutStaffNestedInput = {
    create?: XOR<OrderCreateWithoutStaffInput, OrderUncheckedCreateWithoutStaffInput> | OrderCreateWithoutStaffInput[] | OrderUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutStaffInput | OrderCreateOrConnectWithoutStaffInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutStaffInput | OrderUpsertWithWhereUniqueWithoutStaffInput[]
    createMany?: OrderCreateManyStaffInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutStaffInput | OrderUpdateWithWhereUniqueWithoutStaffInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutStaffInput | OrderUpdateManyWithWhereWithoutStaffInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutStaffNestedInput = {
    create?: XOR<OrderCreateWithoutStaffInput, OrderUncheckedCreateWithoutStaffInput> | OrderCreateWithoutStaffInput[] | OrderUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutStaffInput | OrderCreateOrConnectWithoutStaffInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutStaffInput | OrderUpsertWithWhereUniqueWithoutStaffInput[]
    createMany?: OrderCreateManyStaffInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutStaffInput | OrderUpdateWithWhereUniqueWithoutStaffInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutStaffInput | OrderUpdateManyWithWhereWithoutStaffInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type MenuItemCreateNestedManyWithoutStationInput = {
    create?: XOR<MenuItemCreateWithoutStationInput, MenuItemUncheckedCreateWithoutStationInput> | MenuItemCreateWithoutStationInput[] | MenuItemUncheckedCreateWithoutStationInput[]
    connectOrCreate?: MenuItemCreateOrConnectWithoutStationInput | MenuItemCreateOrConnectWithoutStationInput[]
    createMany?: MenuItemCreateManyStationInputEnvelope
    connect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
  }

  export type KitchenTicketCreateNestedManyWithoutStationInput = {
    create?: XOR<KitchenTicketCreateWithoutStationInput, KitchenTicketUncheckedCreateWithoutStationInput> | KitchenTicketCreateWithoutStationInput[] | KitchenTicketUncheckedCreateWithoutStationInput[]
    connectOrCreate?: KitchenTicketCreateOrConnectWithoutStationInput | KitchenTicketCreateOrConnectWithoutStationInput[]
    createMany?: KitchenTicketCreateManyStationInputEnvelope
    connect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
  }

  export type MenuItemUncheckedCreateNestedManyWithoutStationInput = {
    create?: XOR<MenuItemCreateWithoutStationInput, MenuItemUncheckedCreateWithoutStationInput> | MenuItemCreateWithoutStationInput[] | MenuItemUncheckedCreateWithoutStationInput[]
    connectOrCreate?: MenuItemCreateOrConnectWithoutStationInput | MenuItemCreateOrConnectWithoutStationInput[]
    createMany?: MenuItemCreateManyStationInputEnvelope
    connect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
  }

  export type KitchenTicketUncheckedCreateNestedManyWithoutStationInput = {
    create?: XOR<KitchenTicketCreateWithoutStationInput, KitchenTicketUncheckedCreateWithoutStationInput> | KitchenTicketCreateWithoutStationInput[] | KitchenTicketUncheckedCreateWithoutStationInput[]
    connectOrCreate?: KitchenTicketCreateOrConnectWithoutStationInput | KitchenTicketCreateOrConnectWithoutStationInput[]
    createMany?: KitchenTicketCreateManyStationInputEnvelope
    connect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type MenuItemUpdateManyWithoutStationNestedInput = {
    create?: XOR<MenuItemCreateWithoutStationInput, MenuItemUncheckedCreateWithoutStationInput> | MenuItemCreateWithoutStationInput[] | MenuItemUncheckedCreateWithoutStationInput[]
    connectOrCreate?: MenuItemCreateOrConnectWithoutStationInput | MenuItemCreateOrConnectWithoutStationInput[]
    upsert?: MenuItemUpsertWithWhereUniqueWithoutStationInput | MenuItemUpsertWithWhereUniqueWithoutStationInput[]
    createMany?: MenuItemCreateManyStationInputEnvelope
    set?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    disconnect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    delete?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    connect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    update?: MenuItemUpdateWithWhereUniqueWithoutStationInput | MenuItemUpdateWithWhereUniqueWithoutStationInput[]
    updateMany?: MenuItemUpdateManyWithWhereWithoutStationInput | MenuItemUpdateManyWithWhereWithoutStationInput[]
    deleteMany?: MenuItemScalarWhereInput | MenuItemScalarWhereInput[]
  }

  export type KitchenTicketUpdateManyWithoutStationNestedInput = {
    create?: XOR<KitchenTicketCreateWithoutStationInput, KitchenTicketUncheckedCreateWithoutStationInput> | KitchenTicketCreateWithoutStationInput[] | KitchenTicketUncheckedCreateWithoutStationInput[]
    connectOrCreate?: KitchenTicketCreateOrConnectWithoutStationInput | KitchenTicketCreateOrConnectWithoutStationInput[]
    upsert?: KitchenTicketUpsertWithWhereUniqueWithoutStationInput | KitchenTicketUpsertWithWhereUniqueWithoutStationInput[]
    createMany?: KitchenTicketCreateManyStationInputEnvelope
    set?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    disconnect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    delete?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    connect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    update?: KitchenTicketUpdateWithWhereUniqueWithoutStationInput | KitchenTicketUpdateWithWhereUniqueWithoutStationInput[]
    updateMany?: KitchenTicketUpdateManyWithWhereWithoutStationInput | KitchenTicketUpdateManyWithWhereWithoutStationInput[]
    deleteMany?: KitchenTicketScalarWhereInput | KitchenTicketScalarWhereInput[]
  }

  export type MenuItemUncheckedUpdateManyWithoutStationNestedInput = {
    create?: XOR<MenuItemCreateWithoutStationInput, MenuItemUncheckedCreateWithoutStationInput> | MenuItemCreateWithoutStationInput[] | MenuItemUncheckedCreateWithoutStationInput[]
    connectOrCreate?: MenuItemCreateOrConnectWithoutStationInput | MenuItemCreateOrConnectWithoutStationInput[]
    upsert?: MenuItemUpsertWithWhereUniqueWithoutStationInput | MenuItemUpsertWithWhereUniqueWithoutStationInput[]
    createMany?: MenuItemCreateManyStationInputEnvelope
    set?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    disconnect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    delete?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    connect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    update?: MenuItemUpdateWithWhereUniqueWithoutStationInput | MenuItemUpdateWithWhereUniqueWithoutStationInput[]
    updateMany?: MenuItemUpdateManyWithWhereWithoutStationInput | MenuItemUpdateManyWithWhereWithoutStationInput[]
    deleteMany?: MenuItemScalarWhereInput | MenuItemScalarWhereInput[]
  }

  export type KitchenTicketUncheckedUpdateManyWithoutStationNestedInput = {
    create?: XOR<KitchenTicketCreateWithoutStationInput, KitchenTicketUncheckedCreateWithoutStationInput> | KitchenTicketCreateWithoutStationInput[] | KitchenTicketUncheckedCreateWithoutStationInput[]
    connectOrCreate?: KitchenTicketCreateOrConnectWithoutStationInput | KitchenTicketCreateOrConnectWithoutStationInput[]
    upsert?: KitchenTicketUpsertWithWhereUniqueWithoutStationInput | KitchenTicketUpsertWithWhereUniqueWithoutStationInput[]
    createMany?: KitchenTicketCreateManyStationInputEnvelope
    set?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    disconnect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    delete?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    connect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    update?: KitchenTicketUpdateWithWhereUniqueWithoutStationInput | KitchenTicketUpdateWithWhereUniqueWithoutStationInput[]
    updateMany?: KitchenTicketUpdateManyWithWhereWithoutStationInput | KitchenTicketUpdateManyWithWhereWithoutStationInput[]
    deleteMany?: KitchenTicketScalarWhereInput | KitchenTicketScalarWhereInput[]
  }

  export type MenuItemCreateNestedManyWithoutCategoryInput = {
    create?: XOR<MenuItemCreateWithoutCategoryInput, MenuItemUncheckedCreateWithoutCategoryInput> | MenuItemCreateWithoutCategoryInput[] | MenuItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: MenuItemCreateOrConnectWithoutCategoryInput | MenuItemCreateOrConnectWithoutCategoryInput[]
    createMany?: MenuItemCreateManyCategoryInputEnvelope
    connect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
  }

  export type MenuItemUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<MenuItemCreateWithoutCategoryInput, MenuItemUncheckedCreateWithoutCategoryInput> | MenuItemCreateWithoutCategoryInput[] | MenuItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: MenuItemCreateOrConnectWithoutCategoryInput | MenuItemCreateOrConnectWithoutCategoryInput[]
    createMany?: MenuItemCreateManyCategoryInputEnvelope
    connect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
  }

  export type MenuItemUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<MenuItemCreateWithoutCategoryInput, MenuItemUncheckedCreateWithoutCategoryInput> | MenuItemCreateWithoutCategoryInput[] | MenuItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: MenuItemCreateOrConnectWithoutCategoryInput | MenuItemCreateOrConnectWithoutCategoryInput[]
    upsert?: MenuItemUpsertWithWhereUniqueWithoutCategoryInput | MenuItemUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: MenuItemCreateManyCategoryInputEnvelope
    set?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    disconnect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    delete?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    connect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    update?: MenuItemUpdateWithWhereUniqueWithoutCategoryInput | MenuItemUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: MenuItemUpdateManyWithWhereWithoutCategoryInput | MenuItemUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: MenuItemScalarWhereInput | MenuItemScalarWhereInput[]
  }

  export type MenuItemUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<MenuItemCreateWithoutCategoryInput, MenuItemUncheckedCreateWithoutCategoryInput> | MenuItemCreateWithoutCategoryInput[] | MenuItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: MenuItemCreateOrConnectWithoutCategoryInput | MenuItemCreateOrConnectWithoutCategoryInput[]
    upsert?: MenuItemUpsertWithWhereUniqueWithoutCategoryInput | MenuItemUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: MenuItemCreateManyCategoryInputEnvelope
    set?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    disconnect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    delete?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    connect?: MenuItemWhereUniqueInput | MenuItemWhereUniqueInput[]
    update?: MenuItemUpdateWithWhereUniqueWithoutCategoryInput | MenuItemUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: MenuItemUpdateManyWithWhereWithoutCategoryInput | MenuItemUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: MenuItemScalarWhereInput | MenuItemScalarWhereInput[]
  }

  export type MenuCategoryCreateNestedOneWithoutItemsInput = {
    create?: XOR<MenuCategoryCreateWithoutItemsInput, MenuCategoryUncheckedCreateWithoutItemsInput>
    connectOrCreate?: MenuCategoryCreateOrConnectWithoutItemsInput
    connect?: MenuCategoryWhereUniqueInput
  }

  export type KitchenStationCreateNestedOneWithoutMenuItemsInput = {
    create?: XOR<KitchenStationCreateWithoutMenuItemsInput, KitchenStationUncheckedCreateWithoutMenuItemsInput>
    connectOrCreate?: KitchenStationCreateOrConnectWithoutMenuItemsInput
    connect?: KitchenStationWhereUniqueInput
  }

  export type RecipeIngredientCreateNestedManyWithoutMenuItemInput = {
    create?: XOR<RecipeIngredientCreateWithoutMenuItemInput, RecipeIngredientUncheckedCreateWithoutMenuItemInput> | RecipeIngredientCreateWithoutMenuItemInput[] | RecipeIngredientUncheckedCreateWithoutMenuItemInput[]
    connectOrCreate?: RecipeIngredientCreateOrConnectWithoutMenuItemInput | RecipeIngredientCreateOrConnectWithoutMenuItemInput[]
    createMany?: RecipeIngredientCreateManyMenuItemInputEnvelope
    connect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
  }

  export type OrderItemCreateNestedManyWithoutMenuItemInput = {
    create?: XOR<OrderItemCreateWithoutMenuItemInput, OrderItemUncheckedCreateWithoutMenuItemInput> | OrderItemCreateWithoutMenuItemInput[] | OrderItemUncheckedCreateWithoutMenuItemInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutMenuItemInput | OrderItemCreateOrConnectWithoutMenuItemInput[]
    createMany?: OrderItemCreateManyMenuItemInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type RecipeIngredientUncheckedCreateNestedManyWithoutMenuItemInput = {
    create?: XOR<RecipeIngredientCreateWithoutMenuItemInput, RecipeIngredientUncheckedCreateWithoutMenuItemInput> | RecipeIngredientCreateWithoutMenuItemInput[] | RecipeIngredientUncheckedCreateWithoutMenuItemInput[]
    connectOrCreate?: RecipeIngredientCreateOrConnectWithoutMenuItemInput | RecipeIngredientCreateOrConnectWithoutMenuItemInput[]
    createMany?: RecipeIngredientCreateManyMenuItemInputEnvelope
    connect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
  }

  export type OrderItemUncheckedCreateNestedManyWithoutMenuItemInput = {
    create?: XOR<OrderItemCreateWithoutMenuItemInput, OrderItemUncheckedCreateWithoutMenuItemInput> | OrderItemCreateWithoutMenuItemInput[] | OrderItemUncheckedCreateWithoutMenuItemInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutMenuItemInput | OrderItemCreateOrConnectWithoutMenuItemInput[]
    createMany?: OrderItemCreateManyMenuItemInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MenuCategoryUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<MenuCategoryCreateWithoutItemsInput, MenuCategoryUncheckedCreateWithoutItemsInput>
    connectOrCreate?: MenuCategoryCreateOrConnectWithoutItemsInput
    upsert?: MenuCategoryUpsertWithoutItemsInput
    connect?: MenuCategoryWhereUniqueInput
    update?: XOR<XOR<MenuCategoryUpdateToOneWithWhereWithoutItemsInput, MenuCategoryUpdateWithoutItemsInput>, MenuCategoryUncheckedUpdateWithoutItemsInput>
  }

  export type KitchenStationUpdateOneRequiredWithoutMenuItemsNestedInput = {
    create?: XOR<KitchenStationCreateWithoutMenuItemsInput, KitchenStationUncheckedCreateWithoutMenuItemsInput>
    connectOrCreate?: KitchenStationCreateOrConnectWithoutMenuItemsInput
    upsert?: KitchenStationUpsertWithoutMenuItemsInput
    connect?: KitchenStationWhereUniqueInput
    update?: XOR<XOR<KitchenStationUpdateToOneWithWhereWithoutMenuItemsInput, KitchenStationUpdateWithoutMenuItemsInput>, KitchenStationUncheckedUpdateWithoutMenuItemsInput>
  }

  export type RecipeIngredientUpdateManyWithoutMenuItemNestedInput = {
    create?: XOR<RecipeIngredientCreateWithoutMenuItemInput, RecipeIngredientUncheckedCreateWithoutMenuItemInput> | RecipeIngredientCreateWithoutMenuItemInput[] | RecipeIngredientUncheckedCreateWithoutMenuItemInput[]
    connectOrCreate?: RecipeIngredientCreateOrConnectWithoutMenuItemInput | RecipeIngredientCreateOrConnectWithoutMenuItemInput[]
    upsert?: RecipeIngredientUpsertWithWhereUniqueWithoutMenuItemInput | RecipeIngredientUpsertWithWhereUniqueWithoutMenuItemInput[]
    createMany?: RecipeIngredientCreateManyMenuItemInputEnvelope
    set?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    disconnect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    delete?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    connect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    update?: RecipeIngredientUpdateWithWhereUniqueWithoutMenuItemInput | RecipeIngredientUpdateWithWhereUniqueWithoutMenuItemInput[]
    updateMany?: RecipeIngredientUpdateManyWithWhereWithoutMenuItemInput | RecipeIngredientUpdateManyWithWhereWithoutMenuItemInput[]
    deleteMany?: RecipeIngredientScalarWhereInput | RecipeIngredientScalarWhereInput[]
  }

  export type OrderItemUpdateManyWithoutMenuItemNestedInput = {
    create?: XOR<OrderItemCreateWithoutMenuItemInput, OrderItemUncheckedCreateWithoutMenuItemInput> | OrderItemCreateWithoutMenuItemInput[] | OrderItemUncheckedCreateWithoutMenuItemInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutMenuItemInput | OrderItemCreateOrConnectWithoutMenuItemInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutMenuItemInput | OrderItemUpsertWithWhereUniqueWithoutMenuItemInput[]
    createMany?: OrderItemCreateManyMenuItemInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutMenuItemInput | OrderItemUpdateWithWhereUniqueWithoutMenuItemInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutMenuItemInput | OrderItemUpdateManyWithWhereWithoutMenuItemInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type RecipeIngredientUncheckedUpdateManyWithoutMenuItemNestedInput = {
    create?: XOR<RecipeIngredientCreateWithoutMenuItemInput, RecipeIngredientUncheckedCreateWithoutMenuItemInput> | RecipeIngredientCreateWithoutMenuItemInput[] | RecipeIngredientUncheckedCreateWithoutMenuItemInput[]
    connectOrCreate?: RecipeIngredientCreateOrConnectWithoutMenuItemInput | RecipeIngredientCreateOrConnectWithoutMenuItemInput[]
    upsert?: RecipeIngredientUpsertWithWhereUniqueWithoutMenuItemInput | RecipeIngredientUpsertWithWhereUniqueWithoutMenuItemInput[]
    createMany?: RecipeIngredientCreateManyMenuItemInputEnvelope
    set?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    disconnect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    delete?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    connect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    update?: RecipeIngredientUpdateWithWhereUniqueWithoutMenuItemInput | RecipeIngredientUpdateWithWhereUniqueWithoutMenuItemInput[]
    updateMany?: RecipeIngredientUpdateManyWithWhereWithoutMenuItemInput | RecipeIngredientUpdateManyWithWhereWithoutMenuItemInput[]
    deleteMany?: RecipeIngredientScalarWhereInput | RecipeIngredientScalarWhereInput[]
  }

  export type OrderItemUncheckedUpdateManyWithoutMenuItemNestedInput = {
    create?: XOR<OrderItemCreateWithoutMenuItemInput, OrderItemUncheckedCreateWithoutMenuItemInput> | OrderItemCreateWithoutMenuItemInput[] | OrderItemUncheckedCreateWithoutMenuItemInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutMenuItemInput | OrderItemCreateOrConnectWithoutMenuItemInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutMenuItemInput | OrderItemUpsertWithWhereUniqueWithoutMenuItemInput[]
    createMany?: OrderItemCreateManyMenuItemInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutMenuItemInput | OrderItemUpdateWithWhereUniqueWithoutMenuItemInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutMenuItemInput | OrderItemUpdateManyWithWhereWithoutMenuItemInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type InventoryItemCreateNestedManyWithoutSupplierInput = {
    create?: XOR<InventoryItemCreateWithoutSupplierInput, InventoryItemUncheckedCreateWithoutSupplierInput> | InventoryItemCreateWithoutSupplierInput[] | InventoryItemUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutSupplierInput | InventoryItemCreateOrConnectWithoutSupplierInput[]
    createMany?: InventoryItemCreateManySupplierInputEnvelope
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
  }

  export type InventoryItemUncheckedCreateNestedManyWithoutSupplierInput = {
    create?: XOR<InventoryItemCreateWithoutSupplierInput, InventoryItemUncheckedCreateWithoutSupplierInput> | InventoryItemCreateWithoutSupplierInput[] | InventoryItemUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutSupplierInput | InventoryItemCreateOrConnectWithoutSupplierInput[]
    createMany?: InventoryItemCreateManySupplierInputEnvelope
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InventoryItemUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<InventoryItemCreateWithoutSupplierInput, InventoryItemUncheckedCreateWithoutSupplierInput> | InventoryItemCreateWithoutSupplierInput[] | InventoryItemUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutSupplierInput | InventoryItemCreateOrConnectWithoutSupplierInput[]
    upsert?: InventoryItemUpsertWithWhereUniqueWithoutSupplierInput | InventoryItemUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: InventoryItemCreateManySupplierInputEnvelope
    set?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    disconnect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    delete?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    update?: InventoryItemUpdateWithWhereUniqueWithoutSupplierInput | InventoryItemUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: InventoryItemUpdateManyWithWhereWithoutSupplierInput | InventoryItemUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
  }

  export type InventoryItemUncheckedUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<InventoryItemCreateWithoutSupplierInput, InventoryItemUncheckedCreateWithoutSupplierInput> | InventoryItemCreateWithoutSupplierInput[] | InventoryItemUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutSupplierInput | InventoryItemCreateOrConnectWithoutSupplierInput[]
    upsert?: InventoryItemUpsertWithWhereUniqueWithoutSupplierInput | InventoryItemUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: InventoryItemCreateManySupplierInputEnvelope
    set?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    disconnect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    delete?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    update?: InventoryItemUpdateWithWhereUniqueWithoutSupplierInput | InventoryItemUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: InventoryItemUpdateManyWithWhereWithoutSupplierInput | InventoryItemUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
  }

  export type SupplierCreateNestedOneWithoutInventoryItemsInput = {
    create?: XOR<SupplierCreateWithoutInventoryItemsInput, SupplierUncheckedCreateWithoutInventoryItemsInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutInventoryItemsInput
    connect?: SupplierWhereUniqueInput
  }

  export type RecipeIngredientCreateNestedManyWithoutInventoryItemInput = {
    create?: XOR<RecipeIngredientCreateWithoutInventoryItemInput, RecipeIngredientUncheckedCreateWithoutInventoryItemInput> | RecipeIngredientCreateWithoutInventoryItemInput[] | RecipeIngredientUncheckedCreateWithoutInventoryItemInput[]
    connectOrCreate?: RecipeIngredientCreateOrConnectWithoutInventoryItemInput | RecipeIngredientCreateOrConnectWithoutInventoryItemInput[]
    createMany?: RecipeIngredientCreateManyInventoryItemInputEnvelope
    connect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
  }

  export type InventoryMovementCreateNestedManyWithoutInventoryItemInput = {
    create?: XOR<InventoryMovementCreateWithoutInventoryItemInput, InventoryMovementUncheckedCreateWithoutInventoryItemInput> | InventoryMovementCreateWithoutInventoryItemInput[] | InventoryMovementUncheckedCreateWithoutInventoryItemInput[]
    connectOrCreate?: InventoryMovementCreateOrConnectWithoutInventoryItemInput | InventoryMovementCreateOrConnectWithoutInventoryItemInput[]
    createMany?: InventoryMovementCreateManyInventoryItemInputEnvelope
    connect?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
  }

  export type RecipeIngredientUncheckedCreateNestedManyWithoutInventoryItemInput = {
    create?: XOR<RecipeIngredientCreateWithoutInventoryItemInput, RecipeIngredientUncheckedCreateWithoutInventoryItemInput> | RecipeIngredientCreateWithoutInventoryItemInput[] | RecipeIngredientUncheckedCreateWithoutInventoryItemInput[]
    connectOrCreate?: RecipeIngredientCreateOrConnectWithoutInventoryItemInput | RecipeIngredientCreateOrConnectWithoutInventoryItemInput[]
    createMany?: RecipeIngredientCreateManyInventoryItemInputEnvelope
    connect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
  }

  export type InventoryMovementUncheckedCreateNestedManyWithoutInventoryItemInput = {
    create?: XOR<InventoryMovementCreateWithoutInventoryItemInput, InventoryMovementUncheckedCreateWithoutInventoryItemInput> | InventoryMovementCreateWithoutInventoryItemInput[] | InventoryMovementUncheckedCreateWithoutInventoryItemInput[]
    connectOrCreate?: InventoryMovementCreateOrConnectWithoutInventoryItemInput | InventoryMovementCreateOrConnectWithoutInventoryItemInput[]
    createMany?: InventoryMovementCreateManyInventoryItemInputEnvelope
    connect?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type SupplierUpdateOneWithoutInventoryItemsNestedInput = {
    create?: XOR<SupplierCreateWithoutInventoryItemsInput, SupplierUncheckedCreateWithoutInventoryItemsInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutInventoryItemsInput
    upsert?: SupplierUpsertWithoutInventoryItemsInput
    disconnect?: SupplierWhereInput | boolean
    delete?: SupplierWhereInput | boolean
    connect?: SupplierWhereUniqueInput
    update?: XOR<XOR<SupplierUpdateToOneWithWhereWithoutInventoryItemsInput, SupplierUpdateWithoutInventoryItemsInput>, SupplierUncheckedUpdateWithoutInventoryItemsInput>
  }

  export type RecipeIngredientUpdateManyWithoutInventoryItemNestedInput = {
    create?: XOR<RecipeIngredientCreateWithoutInventoryItemInput, RecipeIngredientUncheckedCreateWithoutInventoryItemInput> | RecipeIngredientCreateWithoutInventoryItemInput[] | RecipeIngredientUncheckedCreateWithoutInventoryItemInput[]
    connectOrCreate?: RecipeIngredientCreateOrConnectWithoutInventoryItemInput | RecipeIngredientCreateOrConnectWithoutInventoryItemInput[]
    upsert?: RecipeIngredientUpsertWithWhereUniqueWithoutInventoryItemInput | RecipeIngredientUpsertWithWhereUniqueWithoutInventoryItemInput[]
    createMany?: RecipeIngredientCreateManyInventoryItemInputEnvelope
    set?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    disconnect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    delete?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    connect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    update?: RecipeIngredientUpdateWithWhereUniqueWithoutInventoryItemInput | RecipeIngredientUpdateWithWhereUniqueWithoutInventoryItemInput[]
    updateMany?: RecipeIngredientUpdateManyWithWhereWithoutInventoryItemInput | RecipeIngredientUpdateManyWithWhereWithoutInventoryItemInput[]
    deleteMany?: RecipeIngredientScalarWhereInput | RecipeIngredientScalarWhereInput[]
  }

  export type InventoryMovementUpdateManyWithoutInventoryItemNestedInput = {
    create?: XOR<InventoryMovementCreateWithoutInventoryItemInput, InventoryMovementUncheckedCreateWithoutInventoryItemInput> | InventoryMovementCreateWithoutInventoryItemInput[] | InventoryMovementUncheckedCreateWithoutInventoryItemInput[]
    connectOrCreate?: InventoryMovementCreateOrConnectWithoutInventoryItemInput | InventoryMovementCreateOrConnectWithoutInventoryItemInput[]
    upsert?: InventoryMovementUpsertWithWhereUniqueWithoutInventoryItemInput | InventoryMovementUpsertWithWhereUniqueWithoutInventoryItemInput[]
    createMany?: InventoryMovementCreateManyInventoryItemInputEnvelope
    set?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
    disconnect?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
    delete?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
    connect?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
    update?: InventoryMovementUpdateWithWhereUniqueWithoutInventoryItemInput | InventoryMovementUpdateWithWhereUniqueWithoutInventoryItemInput[]
    updateMany?: InventoryMovementUpdateManyWithWhereWithoutInventoryItemInput | InventoryMovementUpdateManyWithWhereWithoutInventoryItemInput[]
    deleteMany?: InventoryMovementScalarWhereInput | InventoryMovementScalarWhereInput[]
  }

  export type RecipeIngredientUncheckedUpdateManyWithoutInventoryItemNestedInput = {
    create?: XOR<RecipeIngredientCreateWithoutInventoryItemInput, RecipeIngredientUncheckedCreateWithoutInventoryItemInput> | RecipeIngredientCreateWithoutInventoryItemInput[] | RecipeIngredientUncheckedCreateWithoutInventoryItemInput[]
    connectOrCreate?: RecipeIngredientCreateOrConnectWithoutInventoryItemInput | RecipeIngredientCreateOrConnectWithoutInventoryItemInput[]
    upsert?: RecipeIngredientUpsertWithWhereUniqueWithoutInventoryItemInput | RecipeIngredientUpsertWithWhereUniqueWithoutInventoryItemInput[]
    createMany?: RecipeIngredientCreateManyInventoryItemInputEnvelope
    set?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    disconnect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    delete?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    connect?: RecipeIngredientWhereUniqueInput | RecipeIngredientWhereUniqueInput[]
    update?: RecipeIngredientUpdateWithWhereUniqueWithoutInventoryItemInput | RecipeIngredientUpdateWithWhereUniqueWithoutInventoryItemInput[]
    updateMany?: RecipeIngredientUpdateManyWithWhereWithoutInventoryItemInput | RecipeIngredientUpdateManyWithWhereWithoutInventoryItemInput[]
    deleteMany?: RecipeIngredientScalarWhereInput | RecipeIngredientScalarWhereInput[]
  }

  export type InventoryMovementUncheckedUpdateManyWithoutInventoryItemNestedInput = {
    create?: XOR<InventoryMovementCreateWithoutInventoryItemInput, InventoryMovementUncheckedCreateWithoutInventoryItemInput> | InventoryMovementCreateWithoutInventoryItemInput[] | InventoryMovementUncheckedCreateWithoutInventoryItemInput[]
    connectOrCreate?: InventoryMovementCreateOrConnectWithoutInventoryItemInput | InventoryMovementCreateOrConnectWithoutInventoryItemInput[]
    upsert?: InventoryMovementUpsertWithWhereUniqueWithoutInventoryItemInput | InventoryMovementUpsertWithWhereUniqueWithoutInventoryItemInput[]
    createMany?: InventoryMovementCreateManyInventoryItemInputEnvelope
    set?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
    disconnect?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
    delete?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
    connect?: InventoryMovementWhereUniqueInput | InventoryMovementWhereUniqueInput[]
    update?: InventoryMovementUpdateWithWhereUniqueWithoutInventoryItemInput | InventoryMovementUpdateWithWhereUniqueWithoutInventoryItemInput[]
    updateMany?: InventoryMovementUpdateManyWithWhereWithoutInventoryItemInput | InventoryMovementUpdateManyWithWhereWithoutInventoryItemInput[]
    deleteMany?: InventoryMovementScalarWhereInput | InventoryMovementScalarWhereInput[]
  }

  export type MenuItemCreateNestedOneWithoutRecipeInput = {
    create?: XOR<MenuItemCreateWithoutRecipeInput, MenuItemUncheckedCreateWithoutRecipeInput>
    connectOrCreate?: MenuItemCreateOrConnectWithoutRecipeInput
    connect?: MenuItemWhereUniqueInput
  }

  export type InventoryItemCreateNestedOneWithoutRecipesInput = {
    create?: XOR<InventoryItemCreateWithoutRecipesInput, InventoryItemUncheckedCreateWithoutRecipesInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutRecipesInput
    connect?: InventoryItemWhereUniqueInput
  }

  export type MenuItemUpdateOneRequiredWithoutRecipeNestedInput = {
    create?: XOR<MenuItemCreateWithoutRecipeInput, MenuItemUncheckedCreateWithoutRecipeInput>
    connectOrCreate?: MenuItemCreateOrConnectWithoutRecipeInput
    upsert?: MenuItemUpsertWithoutRecipeInput
    connect?: MenuItemWhereUniqueInput
    update?: XOR<XOR<MenuItemUpdateToOneWithWhereWithoutRecipeInput, MenuItemUpdateWithoutRecipeInput>, MenuItemUncheckedUpdateWithoutRecipeInput>
  }

  export type InventoryItemUpdateOneRequiredWithoutRecipesNestedInput = {
    create?: XOR<InventoryItemCreateWithoutRecipesInput, InventoryItemUncheckedCreateWithoutRecipesInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutRecipesInput
    upsert?: InventoryItemUpsertWithoutRecipesInput
    connect?: InventoryItemWhereUniqueInput
    update?: XOR<XOR<InventoryItemUpdateToOneWithWhereWithoutRecipesInput, InventoryItemUpdateWithoutRecipesInput>, InventoryItemUncheckedUpdateWithoutRecipesInput>
  }

  export type InventoryItemCreateNestedOneWithoutMovementsInput = {
    create?: XOR<InventoryItemCreateWithoutMovementsInput, InventoryItemUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutMovementsInput
    connect?: InventoryItemWhereUniqueInput
  }

  export type InventoryItemUpdateOneRequiredWithoutMovementsNestedInput = {
    create?: XOR<InventoryItemCreateWithoutMovementsInput, InventoryItemUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutMovementsInput
    upsert?: InventoryItemUpsertWithoutMovementsInput
    connect?: InventoryItemWhereUniqueInput
    update?: XOR<XOR<InventoryItemUpdateToOneWithWhereWithoutMovementsInput, InventoryItemUpdateWithoutMovementsInput>, InventoryItemUncheckedUpdateWithoutMovementsInput>
  }

  export type OrderCreateNestedManyWithoutTableInput = {
    create?: XOR<OrderCreateWithoutTableInput, OrderUncheckedCreateWithoutTableInput> | OrderCreateWithoutTableInput[] | OrderUncheckedCreateWithoutTableInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutTableInput | OrderCreateOrConnectWithoutTableInput[]
    createMany?: OrderCreateManyTableInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutTableInput = {
    create?: XOR<OrderCreateWithoutTableInput, OrderUncheckedCreateWithoutTableInput> | OrderCreateWithoutTableInput[] | OrderUncheckedCreateWithoutTableInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutTableInput | OrderCreateOrConnectWithoutTableInput[]
    createMany?: OrderCreateManyTableInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OrderUpdateManyWithoutTableNestedInput = {
    create?: XOR<OrderCreateWithoutTableInput, OrderUncheckedCreateWithoutTableInput> | OrderCreateWithoutTableInput[] | OrderUncheckedCreateWithoutTableInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutTableInput | OrderCreateOrConnectWithoutTableInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutTableInput | OrderUpsertWithWhereUniqueWithoutTableInput[]
    createMany?: OrderCreateManyTableInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutTableInput | OrderUpdateWithWhereUniqueWithoutTableInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutTableInput | OrderUpdateManyWithWhereWithoutTableInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutTableNestedInput = {
    create?: XOR<OrderCreateWithoutTableInput, OrderUncheckedCreateWithoutTableInput> | OrderCreateWithoutTableInput[] | OrderUncheckedCreateWithoutTableInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutTableInput | OrderCreateOrConnectWithoutTableInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutTableInput | OrderUpsertWithWhereUniqueWithoutTableInput[]
    createMany?: OrderCreateManyTableInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutTableInput | OrderUpdateWithWhereUniqueWithoutTableInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutTableInput | OrderUpdateManyWithWhereWithoutTableInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type TableCreateNestedOneWithoutOrdersInput = {
    create?: XOR<TableCreateWithoutOrdersInput, TableUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: TableCreateOrConnectWithoutOrdersInput
    connect?: TableWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOrdersInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    connect?: UserWhereUniqueInput
  }

  export type OrderItemCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type KitchenTicketCreateNestedManyWithoutOrderInput = {
    create?: XOR<KitchenTicketCreateWithoutOrderInput, KitchenTicketUncheckedCreateWithoutOrderInput> | KitchenTicketCreateWithoutOrderInput[] | KitchenTicketUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: KitchenTicketCreateOrConnectWithoutOrderInput | KitchenTicketCreateOrConnectWithoutOrderInput[]
    createMany?: KitchenTicketCreateManyOrderInputEnvelope
    connect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
  }

  export type OrderItemUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type KitchenTicketUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<KitchenTicketCreateWithoutOrderInput, KitchenTicketUncheckedCreateWithoutOrderInput> | KitchenTicketCreateWithoutOrderInput[] | KitchenTicketUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: KitchenTicketCreateOrConnectWithoutOrderInput | KitchenTicketCreateOrConnectWithoutOrderInput[]
    createMany?: KitchenTicketCreateManyOrderInputEnvelope
    connect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
  }

  export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod
  }

  export type TableUpdateOneWithoutOrdersNestedInput = {
    create?: XOR<TableCreateWithoutOrdersInput, TableUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: TableCreateOrConnectWithoutOrdersInput
    upsert?: TableUpsertWithoutOrdersInput
    disconnect?: TableWhereInput | boolean
    delete?: TableWhereInput | boolean
    connect?: TableWhereUniqueInput
    update?: XOR<XOR<TableUpdateToOneWithWhereWithoutOrdersInput, TableUpdateWithoutOrdersInput>, TableUncheckedUpdateWithoutOrdersInput>
  }

  export type UserUpdateOneWithoutOrdersNestedInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    upsert?: UserUpsertWithoutOrdersInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrdersInput, UserUpdateWithoutOrdersInput>, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type OrderItemUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutOrderInput | OrderItemUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutOrderInput | OrderItemUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutOrderInput | OrderItemUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type KitchenTicketUpdateManyWithoutOrderNestedInput = {
    create?: XOR<KitchenTicketCreateWithoutOrderInput, KitchenTicketUncheckedCreateWithoutOrderInput> | KitchenTicketCreateWithoutOrderInput[] | KitchenTicketUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: KitchenTicketCreateOrConnectWithoutOrderInput | KitchenTicketCreateOrConnectWithoutOrderInput[]
    upsert?: KitchenTicketUpsertWithWhereUniqueWithoutOrderInput | KitchenTicketUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: KitchenTicketCreateManyOrderInputEnvelope
    set?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    disconnect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    delete?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    connect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    update?: KitchenTicketUpdateWithWhereUniqueWithoutOrderInput | KitchenTicketUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: KitchenTicketUpdateManyWithWhereWithoutOrderInput | KitchenTicketUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: KitchenTicketScalarWhereInput | KitchenTicketScalarWhereInput[]
  }

  export type OrderItemUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutOrderInput | OrderItemUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutOrderInput | OrderItemUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutOrderInput | OrderItemUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type KitchenTicketUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<KitchenTicketCreateWithoutOrderInput, KitchenTicketUncheckedCreateWithoutOrderInput> | KitchenTicketCreateWithoutOrderInput[] | KitchenTicketUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: KitchenTicketCreateOrConnectWithoutOrderInput | KitchenTicketCreateOrConnectWithoutOrderInput[]
    upsert?: KitchenTicketUpsertWithWhereUniqueWithoutOrderInput | KitchenTicketUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: KitchenTicketCreateManyOrderInputEnvelope
    set?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    disconnect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    delete?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    connect?: KitchenTicketWhereUniqueInput | KitchenTicketWhereUniqueInput[]
    update?: KitchenTicketUpdateWithWhereUniqueWithoutOrderInput | KitchenTicketUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: KitchenTicketUpdateManyWithWhereWithoutOrderInput | KitchenTicketUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: KitchenTicketScalarWhereInput | KitchenTicketScalarWhereInput[]
  }

  export type OrderCreateNestedOneWithoutItemsInput = {
    create?: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutItemsInput
    connect?: OrderWhereUniqueInput
  }

  export type MenuItemCreateNestedOneWithoutOrderItemsInput = {
    create?: XOR<MenuItemCreateWithoutOrderItemsInput, MenuItemUncheckedCreateWithoutOrderItemsInput>
    connectOrCreate?: MenuItemCreateOrConnectWithoutOrderItemsInput
    connect?: MenuItemWhereUniqueInput
  }

  export type OrderUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutItemsInput
    upsert?: OrderUpsertWithoutItemsInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutItemsInput, OrderUpdateWithoutItemsInput>, OrderUncheckedUpdateWithoutItemsInput>
  }

  export type MenuItemUpdateOneRequiredWithoutOrderItemsNestedInput = {
    create?: XOR<MenuItemCreateWithoutOrderItemsInput, MenuItemUncheckedCreateWithoutOrderItemsInput>
    connectOrCreate?: MenuItemCreateOrConnectWithoutOrderItemsInput
    upsert?: MenuItemUpsertWithoutOrderItemsInput
    connect?: MenuItemWhereUniqueInput
    update?: XOR<XOR<MenuItemUpdateToOneWithWhereWithoutOrderItemsInput, MenuItemUpdateWithoutOrderItemsInput>, MenuItemUncheckedUpdateWithoutOrderItemsInput>
  }

  export type OrderCreateNestedOneWithoutTicketsInput = {
    create?: XOR<OrderCreateWithoutTicketsInput, OrderUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutTicketsInput
    connect?: OrderWhereUniqueInput
  }

  export type KitchenStationCreateNestedOneWithoutTicketsInput = {
    create?: XOR<KitchenStationCreateWithoutTicketsInput, KitchenStationUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: KitchenStationCreateOrConnectWithoutTicketsInput
    connect?: KitchenStationWhereUniqueInput
  }

  export type EnumTicketStatusFieldUpdateOperationsInput = {
    set?: $Enums.TicketStatus
  }

  export type OrderUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: XOR<OrderCreateWithoutTicketsInput, OrderUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutTicketsInput
    upsert?: OrderUpsertWithoutTicketsInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutTicketsInput, OrderUpdateWithoutTicketsInput>, OrderUncheckedUpdateWithoutTicketsInput>
  }

  export type KitchenStationUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: XOR<KitchenStationCreateWithoutTicketsInput, KitchenStationUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: KitchenStationCreateOrConnectWithoutTicketsInput
    upsert?: KitchenStationUpsertWithoutTicketsInput
    connect?: KitchenStationWhereUniqueInput
    update?: XOR<XOR<KitchenStationUpdateToOneWithWhereWithoutTicketsInput, KitchenStationUpdateWithoutTicketsInput>, KitchenStationUncheckedUpdateWithoutTicketsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OrderCreateWithoutStaffInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    table?: TableCreateNestedOneWithoutOrdersInput
    items?: OrderItemCreateNestedManyWithoutOrderInput
    tickets?: KitchenTicketCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutStaffInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    tableId?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
    tickets?: KitchenTicketUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutStaffInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutStaffInput, OrderUncheckedCreateWithoutStaffInput>
  }

  export type OrderCreateManyStaffInputEnvelope = {
    data: OrderCreateManyStaffInput | OrderCreateManyStaffInput[]
    skipDuplicates?: boolean
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type OrderUpsertWithWhereUniqueWithoutStaffInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutStaffInput, OrderUncheckedUpdateWithoutStaffInput>
    create: XOR<OrderCreateWithoutStaffInput, OrderUncheckedCreateWithoutStaffInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutStaffInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutStaffInput, OrderUncheckedUpdateWithoutStaffInput>
  }

  export type OrderUpdateManyWithWhereWithoutStaffInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutStaffInput>
  }

  export type OrderScalarWhereInput = {
    AND?: OrderScalarWhereInput | OrderScalarWhereInput[]
    OR?: OrderScalarWhereInput[]
    NOT?: OrderScalarWhereInput | OrderScalarWhereInput[]
    id?: StringFilter<"Order"> | string
    number?: StringFilter<"Order"> | string
    status?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    channel?: StringFilter<"Order"> | string
    customerName?: StringNullableFilter<"Order"> | string | null
    customerPhone?: StringNullableFilter<"Order"> | string | null
    tableId?: StringNullableFilter<"Order"> | string | null
    staffId?: StringNullableFilter<"Order"> | string | null
    subtotal?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    tip?: DecimalNullableFilter<"Order"> | Decimal | DecimalJsLike | number | string | null
    discount?: DecimalNullableFilter<"Order"> | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFilter<"Order"> | $Enums.PaymentMethod
    notes?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: OrderCreateNestedManyWithoutStaffInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: OrderUncheckedCreateNestedManyWithoutStaffInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUpdateManyWithoutStaffNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUncheckedUpdateManyWithoutStaffNestedInput
  }

  export type MenuItemCreateWithoutStationInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    category: MenuCategoryCreateNestedOneWithoutItemsInput
    recipe?: RecipeIngredientCreateNestedManyWithoutMenuItemInput
    orderItems?: OrderItemCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemUncheckedCreateWithoutStationInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    categoryId: string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    recipe?: RecipeIngredientUncheckedCreateNestedManyWithoutMenuItemInput
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemCreateOrConnectWithoutStationInput = {
    where: MenuItemWhereUniqueInput
    create: XOR<MenuItemCreateWithoutStationInput, MenuItemUncheckedCreateWithoutStationInput>
  }

  export type MenuItemCreateManyStationInputEnvelope = {
    data: MenuItemCreateManyStationInput | MenuItemCreateManyStationInput[]
    skipDuplicates?: boolean
  }

  export type KitchenTicketCreateWithoutStationInput = {
    id?: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    order: OrderCreateNestedOneWithoutTicketsInput
  }

  export type KitchenTicketUncheckedCreateWithoutStationInput = {
    id?: string
    orderId: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KitchenTicketCreateOrConnectWithoutStationInput = {
    where: KitchenTicketWhereUniqueInput
    create: XOR<KitchenTicketCreateWithoutStationInput, KitchenTicketUncheckedCreateWithoutStationInput>
  }

  export type KitchenTicketCreateManyStationInputEnvelope = {
    data: KitchenTicketCreateManyStationInput | KitchenTicketCreateManyStationInput[]
    skipDuplicates?: boolean
  }

  export type MenuItemUpsertWithWhereUniqueWithoutStationInput = {
    where: MenuItemWhereUniqueInput
    update: XOR<MenuItemUpdateWithoutStationInput, MenuItemUncheckedUpdateWithoutStationInput>
    create: XOR<MenuItemCreateWithoutStationInput, MenuItemUncheckedCreateWithoutStationInput>
  }

  export type MenuItemUpdateWithWhereUniqueWithoutStationInput = {
    where: MenuItemWhereUniqueInput
    data: XOR<MenuItemUpdateWithoutStationInput, MenuItemUncheckedUpdateWithoutStationInput>
  }

  export type MenuItemUpdateManyWithWhereWithoutStationInput = {
    where: MenuItemScalarWhereInput
    data: XOR<MenuItemUpdateManyMutationInput, MenuItemUncheckedUpdateManyWithoutStationInput>
  }

  export type MenuItemScalarWhereInput = {
    AND?: MenuItemScalarWhereInput | MenuItemScalarWhereInput[]
    OR?: MenuItemScalarWhereInput[]
    NOT?: MenuItemScalarWhereInput | MenuItemScalarWhereInput[]
    id?: StringFilter<"MenuItem"> | string
    name?: StringFilter<"MenuItem"> | string
    description?: StringNullableFilter<"MenuItem"> | string | null
    price?: DecimalFilter<"MenuItem"> | Decimal | DecimalJsLike | number | string
    sku?: StringNullableFilter<"MenuItem"> | string | null
    available?: BoolFilter<"MenuItem"> | boolean
    posVisible?: BoolFilter<"MenuItem"> | boolean
    popular?: BoolFilter<"MenuItem"> | boolean
    prepTimeMinutes?: IntNullableFilter<"MenuItem"> | number | null
    image?: StringNullableFilter<"MenuItem"> | string | null
    categoryId?: StringFilter<"MenuItem"> | string
    stationId?: StringFilter<"MenuItem"> | string
    modifiers?: JsonNullableFilter<"MenuItem">
    createdAt?: DateTimeFilter<"MenuItem"> | Date | string
    updatedAt?: DateTimeFilter<"MenuItem"> | Date | string
  }

  export type KitchenTicketUpsertWithWhereUniqueWithoutStationInput = {
    where: KitchenTicketWhereUniqueInput
    update: XOR<KitchenTicketUpdateWithoutStationInput, KitchenTicketUncheckedUpdateWithoutStationInput>
    create: XOR<KitchenTicketCreateWithoutStationInput, KitchenTicketUncheckedCreateWithoutStationInput>
  }

  export type KitchenTicketUpdateWithWhereUniqueWithoutStationInput = {
    where: KitchenTicketWhereUniqueInput
    data: XOR<KitchenTicketUpdateWithoutStationInput, KitchenTicketUncheckedUpdateWithoutStationInput>
  }

  export type KitchenTicketUpdateManyWithWhereWithoutStationInput = {
    where: KitchenTicketScalarWhereInput
    data: XOR<KitchenTicketUpdateManyMutationInput, KitchenTicketUncheckedUpdateManyWithoutStationInput>
  }

  export type KitchenTicketScalarWhereInput = {
    AND?: KitchenTicketScalarWhereInput | KitchenTicketScalarWhereInput[]
    OR?: KitchenTicketScalarWhereInput[]
    NOT?: KitchenTicketScalarWhereInput | KitchenTicketScalarWhereInput[]
    id?: StringFilter<"KitchenTicket"> | string
    orderId?: StringFilter<"KitchenTicket"> | string
    stationId?: StringFilter<"KitchenTicket"> | string
    status?: EnumTicketStatusFilter<"KitchenTicket"> | $Enums.TicketStatus
    createdAt?: DateTimeFilter<"KitchenTicket"> | Date | string
    updatedAt?: DateTimeFilter<"KitchenTicket"> | Date | string
  }

  export type MenuItemCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    station: KitchenStationCreateNestedOneWithoutMenuItemsInput
    recipe?: RecipeIngredientCreateNestedManyWithoutMenuItemInput
    orderItems?: OrderItemCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    stationId: string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    recipe?: RecipeIngredientUncheckedCreateNestedManyWithoutMenuItemInput
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemCreateOrConnectWithoutCategoryInput = {
    where: MenuItemWhereUniqueInput
    create: XOR<MenuItemCreateWithoutCategoryInput, MenuItemUncheckedCreateWithoutCategoryInput>
  }

  export type MenuItemCreateManyCategoryInputEnvelope = {
    data: MenuItemCreateManyCategoryInput | MenuItemCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type MenuItemUpsertWithWhereUniqueWithoutCategoryInput = {
    where: MenuItemWhereUniqueInput
    update: XOR<MenuItemUpdateWithoutCategoryInput, MenuItemUncheckedUpdateWithoutCategoryInput>
    create: XOR<MenuItemCreateWithoutCategoryInput, MenuItemUncheckedCreateWithoutCategoryInput>
  }

  export type MenuItemUpdateWithWhereUniqueWithoutCategoryInput = {
    where: MenuItemWhereUniqueInput
    data: XOR<MenuItemUpdateWithoutCategoryInput, MenuItemUncheckedUpdateWithoutCategoryInput>
  }

  export type MenuItemUpdateManyWithWhereWithoutCategoryInput = {
    where: MenuItemScalarWhereInput
    data: XOR<MenuItemUpdateManyMutationInput, MenuItemUncheckedUpdateManyWithoutCategoryInput>
  }

  export type MenuCategoryCreateWithoutItemsInput = {
    id?: string
    name: string
    slug: string
    color: string
    createdAt?: Date | string
  }

  export type MenuCategoryUncheckedCreateWithoutItemsInput = {
    id?: string
    name: string
    slug: string
    color: string
    createdAt?: Date | string
  }

  export type MenuCategoryCreateOrConnectWithoutItemsInput = {
    where: MenuCategoryWhereUniqueInput
    create: XOR<MenuCategoryCreateWithoutItemsInput, MenuCategoryUncheckedCreateWithoutItemsInput>
  }

  export type KitchenStationCreateWithoutMenuItemsInput = {
    id?: string
    name: string
    printer?: string | null
    active?: boolean
    color?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: KitchenTicketCreateNestedManyWithoutStationInput
  }

  export type KitchenStationUncheckedCreateWithoutMenuItemsInput = {
    id?: string
    name: string
    printer?: string | null
    active?: boolean
    color?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: KitchenTicketUncheckedCreateNestedManyWithoutStationInput
  }

  export type KitchenStationCreateOrConnectWithoutMenuItemsInput = {
    where: KitchenStationWhereUniqueInput
    create: XOR<KitchenStationCreateWithoutMenuItemsInput, KitchenStationUncheckedCreateWithoutMenuItemsInput>
  }

  export type RecipeIngredientCreateWithoutMenuItemInput = {
    id?: string
    quantity: Decimal | DecimalJsLike | number | string
    unit: string
    inventoryItem: InventoryItemCreateNestedOneWithoutRecipesInput
  }

  export type RecipeIngredientUncheckedCreateWithoutMenuItemInput = {
    id?: string
    inventoryItemId: string
    quantity: Decimal | DecimalJsLike | number | string
    unit: string
  }

  export type RecipeIngredientCreateOrConnectWithoutMenuItemInput = {
    where: RecipeIngredientWhereUniqueInput
    create: XOR<RecipeIngredientCreateWithoutMenuItemInput, RecipeIngredientUncheckedCreateWithoutMenuItemInput>
  }

  export type RecipeIngredientCreateManyMenuItemInputEnvelope = {
    data: RecipeIngredientCreateManyMenuItemInput | RecipeIngredientCreateManyMenuItemInput[]
    skipDuplicates?: boolean
  }

  export type OrderItemCreateWithoutMenuItemInput = {
    id?: string
    name: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: string | null
    order: OrderCreateNestedOneWithoutItemsInput
  }

  export type OrderItemUncheckedCreateWithoutMenuItemInput = {
    id?: string
    orderId: string
    name: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: string | null
  }

  export type OrderItemCreateOrConnectWithoutMenuItemInput = {
    where: OrderItemWhereUniqueInput
    create: XOR<OrderItemCreateWithoutMenuItemInput, OrderItemUncheckedCreateWithoutMenuItemInput>
  }

  export type OrderItemCreateManyMenuItemInputEnvelope = {
    data: OrderItemCreateManyMenuItemInput | OrderItemCreateManyMenuItemInput[]
    skipDuplicates?: boolean
  }

  export type MenuCategoryUpsertWithoutItemsInput = {
    update: XOR<MenuCategoryUpdateWithoutItemsInput, MenuCategoryUncheckedUpdateWithoutItemsInput>
    create: XOR<MenuCategoryCreateWithoutItemsInput, MenuCategoryUncheckedCreateWithoutItemsInput>
    where?: MenuCategoryWhereInput
  }

  export type MenuCategoryUpdateToOneWithWhereWithoutItemsInput = {
    where?: MenuCategoryWhereInput
    data: XOR<MenuCategoryUpdateWithoutItemsInput, MenuCategoryUncheckedUpdateWithoutItemsInput>
  }

  export type MenuCategoryUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MenuCategoryUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KitchenStationUpsertWithoutMenuItemsInput = {
    update: XOR<KitchenStationUpdateWithoutMenuItemsInput, KitchenStationUncheckedUpdateWithoutMenuItemsInput>
    create: XOR<KitchenStationCreateWithoutMenuItemsInput, KitchenStationUncheckedCreateWithoutMenuItemsInput>
    where?: KitchenStationWhereInput
  }

  export type KitchenStationUpdateToOneWithWhereWithoutMenuItemsInput = {
    where?: KitchenStationWhereInput
    data: XOR<KitchenStationUpdateWithoutMenuItemsInput, KitchenStationUncheckedUpdateWithoutMenuItemsInput>
  }

  export type KitchenStationUpdateWithoutMenuItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    printer?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: KitchenTicketUpdateManyWithoutStationNestedInput
  }

  export type KitchenStationUncheckedUpdateWithoutMenuItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    printer?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: KitchenTicketUncheckedUpdateManyWithoutStationNestedInput
  }

  export type RecipeIngredientUpsertWithWhereUniqueWithoutMenuItemInput = {
    where: RecipeIngredientWhereUniqueInput
    update: XOR<RecipeIngredientUpdateWithoutMenuItemInput, RecipeIngredientUncheckedUpdateWithoutMenuItemInput>
    create: XOR<RecipeIngredientCreateWithoutMenuItemInput, RecipeIngredientUncheckedCreateWithoutMenuItemInput>
  }

  export type RecipeIngredientUpdateWithWhereUniqueWithoutMenuItemInput = {
    where: RecipeIngredientWhereUniqueInput
    data: XOR<RecipeIngredientUpdateWithoutMenuItemInput, RecipeIngredientUncheckedUpdateWithoutMenuItemInput>
  }

  export type RecipeIngredientUpdateManyWithWhereWithoutMenuItemInput = {
    where: RecipeIngredientScalarWhereInput
    data: XOR<RecipeIngredientUpdateManyMutationInput, RecipeIngredientUncheckedUpdateManyWithoutMenuItemInput>
  }

  export type RecipeIngredientScalarWhereInput = {
    AND?: RecipeIngredientScalarWhereInput | RecipeIngredientScalarWhereInput[]
    OR?: RecipeIngredientScalarWhereInput[]
    NOT?: RecipeIngredientScalarWhereInput | RecipeIngredientScalarWhereInput[]
    id?: StringFilter<"RecipeIngredient"> | string
    menuItemId?: StringFilter<"RecipeIngredient"> | string
    inventoryItemId?: StringFilter<"RecipeIngredient"> | string
    quantity?: DecimalFilter<"RecipeIngredient"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"RecipeIngredient"> | string
  }

  export type OrderItemUpsertWithWhereUniqueWithoutMenuItemInput = {
    where: OrderItemWhereUniqueInput
    update: XOR<OrderItemUpdateWithoutMenuItemInput, OrderItemUncheckedUpdateWithoutMenuItemInput>
    create: XOR<OrderItemCreateWithoutMenuItemInput, OrderItemUncheckedCreateWithoutMenuItemInput>
  }

  export type OrderItemUpdateWithWhereUniqueWithoutMenuItemInput = {
    where: OrderItemWhereUniqueInput
    data: XOR<OrderItemUpdateWithoutMenuItemInput, OrderItemUncheckedUpdateWithoutMenuItemInput>
  }

  export type OrderItemUpdateManyWithWhereWithoutMenuItemInput = {
    where: OrderItemScalarWhereInput
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyWithoutMenuItemInput>
  }

  export type OrderItemScalarWhereInput = {
    AND?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
    OR?: OrderItemScalarWhereInput[]
    NOT?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
    id?: StringFilter<"OrderItem"> | string
    orderId?: StringFilter<"OrderItem"> | string
    menuItemId?: StringFilter<"OrderItem"> | string
    name?: StringFilter<"OrderItem"> | string
    quantity?: IntFilter<"OrderItem"> | number
    unitPrice?: DecimalFilter<"OrderItem"> | Decimal | DecimalJsLike | number | string
    modifiers?: JsonNullableFilter<"OrderItem">
    note?: StringNullableFilter<"OrderItem"> | string | null
  }

  export type InventoryItemCreateWithoutSupplierInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeIngredientCreateNestedManyWithoutInventoryItemInput
    movements?: InventoryMovementCreateNestedManyWithoutInventoryItemInput
  }

  export type InventoryItemUncheckedCreateWithoutSupplierInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeIngredientUncheckedCreateNestedManyWithoutInventoryItemInput
    movements?: InventoryMovementUncheckedCreateNestedManyWithoutInventoryItemInput
  }

  export type InventoryItemCreateOrConnectWithoutSupplierInput = {
    where: InventoryItemWhereUniqueInput
    create: XOR<InventoryItemCreateWithoutSupplierInput, InventoryItemUncheckedCreateWithoutSupplierInput>
  }

  export type InventoryItemCreateManySupplierInputEnvelope = {
    data: InventoryItemCreateManySupplierInput | InventoryItemCreateManySupplierInput[]
    skipDuplicates?: boolean
  }

  export type InventoryItemUpsertWithWhereUniqueWithoutSupplierInput = {
    where: InventoryItemWhereUniqueInput
    update: XOR<InventoryItemUpdateWithoutSupplierInput, InventoryItemUncheckedUpdateWithoutSupplierInput>
    create: XOR<InventoryItemCreateWithoutSupplierInput, InventoryItemUncheckedCreateWithoutSupplierInput>
  }

  export type InventoryItemUpdateWithWhereUniqueWithoutSupplierInput = {
    where: InventoryItemWhereUniqueInput
    data: XOR<InventoryItemUpdateWithoutSupplierInput, InventoryItemUncheckedUpdateWithoutSupplierInput>
  }

  export type InventoryItemUpdateManyWithWhereWithoutSupplierInput = {
    where: InventoryItemScalarWhereInput
    data: XOR<InventoryItemUpdateManyMutationInput, InventoryItemUncheckedUpdateManyWithoutSupplierInput>
  }

  export type InventoryItemScalarWhereInput = {
    AND?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
    OR?: InventoryItemScalarWhereInput[]
    NOT?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
    id?: StringFilter<"InventoryItem"> | string
    name?: StringFilter<"InventoryItem"> | string
    sku?: StringFilter<"InventoryItem"> | string
    category?: StringFilter<"InventoryItem"> | string
    unit?: StringFilter<"InventoryItem"> | string
    stock?: DecimalFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFilter<"InventoryItem"> | Decimal | DecimalJsLike | number | string
    supplierId?: StringNullableFilter<"InventoryItem"> | string | null
    lastRestocked?: DateTimeNullableFilter<"InventoryItem"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"InventoryItem"> | Date | string | null
    createdAt?: DateTimeFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryItem"> | Date | string
  }

  export type SupplierCreateWithoutInventoryItemsInput = {
    id?: string
    name: string
    contact?: string | null
    email?: string | null
    phone?: string | null
    rating?: number
    createdAt?: Date | string
  }

  export type SupplierUncheckedCreateWithoutInventoryItemsInput = {
    id?: string
    name: string
    contact?: string | null
    email?: string | null
    phone?: string | null
    rating?: number
    createdAt?: Date | string
  }

  export type SupplierCreateOrConnectWithoutInventoryItemsInput = {
    where: SupplierWhereUniqueInput
    create: XOR<SupplierCreateWithoutInventoryItemsInput, SupplierUncheckedCreateWithoutInventoryItemsInput>
  }

  export type RecipeIngredientCreateWithoutInventoryItemInput = {
    id?: string
    quantity: Decimal | DecimalJsLike | number | string
    unit: string
    menuItem: MenuItemCreateNestedOneWithoutRecipeInput
  }

  export type RecipeIngredientUncheckedCreateWithoutInventoryItemInput = {
    id?: string
    menuItemId: string
    quantity: Decimal | DecimalJsLike | number | string
    unit: string
  }

  export type RecipeIngredientCreateOrConnectWithoutInventoryItemInput = {
    where: RecipeIngredientWhereUniqueInput
    create: XOR<RecipeIngredientCreateWithoutInventoryItemInput, RecipeIngredientUncheckedCreateWithoutInventoryItemInput>
  }

  export type RecipeIngredientCreateManyInventoryItemInputEnvelope = {
    data: RecipeIngredientCreateManyInventoryItemInput | RecipeIngredientCreateManyInventoryItemInput[]
    skipDuplicates?: boolean
  }

  export type InventoryMovementCreateWithoutInventoryItemInput = {
    id?: string
    delta: Decimal | DecimalJsLike | number | string
    reason: string
    orderId?: string | null
    createdAt?: Date | string
  }

  export type InventoryMovementUncheckedCreateWithoutInventoryItemInput = {
    id?: string
    delta: Decimal | DecimalJsLike | number | string
    reason: string
    orderId?: string | null
    createdAt?: Date | string
  }

  export type InventoryMovementCreateOrConnectWithoutInventoryItemInput = {
    where: InventoryMovementWhereUniqueInput
    create: XOR<InventoryMovementCreateWithoutInventoryItemInput, InventoryMovementUncheckedCreateWithoutInventoryItemInput>
  }

  export type InventoryMovementCreateManyInventoryItemInputEnvelope = {
    data: InventoryMovementCreateManyInventoryItemInput | InventoryMovementCreateManyInventoryItemInput[]
    skipDuplicates?: boolean
  }

  export type SupplierUpsertWithoutInventoryItemsInput = {
    update: XOR<SupplierUpdateWithoutInventoryItemsInput, SupplierUncheckedUpdateWithoutInventoryItemsInput>
    create: XOR<SupplierCreateWithoutInventoryItemsInput, SupplierUncheckedCreateWithoutInventoryItemsInput>
    where?: SupplierWhereInput
  }

  export type SupplierUpdateToOneWithWhereWithoutInventoryItemsInput = {
    where?: SupplierWhereInput
    data: XOR<SupplierUpdateWithoutInventoryItemsInput, SupplierUncheckedUpdateWithoutInventoryItemsInput>
  }

  export type SupplierUpdateWithoutInventoryItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierUncheckedUpdateWithoutInventoryItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipeIngredientUpsertWithWhereUniqueWithoutInventoryItemInput = {
    where: RecipeIngredientWhereUniqueInput
    update: XOR<RecipeIngredientUpdateWithoutInventoryItemInput, RecipeIngredientUncheckedUpdateWithoutInventoryItemInput>
    create: XOR<RecipeIngredientCreateWithoutInventoryItemInput, RecipeIngredientUncheckedCreateWithoutInventoryItemInput>
  }

  export type RecipeIngredientUpdateWithWhereUniqueWithoutInventoryItemInput = {
    where: RecipeIngredientWhereUniqueInput
    data: XOR<RecipeIngredientUpdateWithoutInventoryItemInput, RecipeIngredientUncheckedUpdateWithoutInventoryItemInput>
  }

  export type RecipeIngredientUpdateManyWithWhereWithoutInventoryItemInput = {
    where: RecipeIngredientScalarWhereInput
    data: XOR<RecipeIngredientUpdateManyMutationInput, RecipeIngredientUncheckedUpdateManyWithoutInventoryItemInput>
  }

  export type InventoryMovementUpsertWithWhereUniqueWithoutInventoryItemInput = {
    where: InventoryMovementWhereUniqueInput
    update: XOR<InventoryMovementUpdateWithoutInventoryItemInput, InventoryMovementUncheckedUpdateWithoutInventoryItemInput>
    create: XOR<InventoryMovementCreateWithoutInventoryItemInput, InventoryMovementUncheckedCreateWithoutInventoryItemInput>
  }

  export type InventoryMovementUpdateWithWhereUniqueWithoutInventoryItemInput = {
    where: InventoryMovementWhereUniqueInput
    data: XOR<InventoryMovementUpdateWithoutInventoryItemInput, InventoryMovementUncheckedUpdateWithoutInventoryItemInput>
  }

  export type InventoryMovementUpdateManyWithWhereWithoutInventoryItemInput = {
    where: InventoryMovementScalarWhereInput
    data: XOR<InventoryMovementUpdateManyMutationInput, InventoryMovementUncheckedUpdateManyWithoutInventoryItemInput>
  }

  export type InventoryMovementScalarWhereInput = {
    AND?: InventoryMovementScalarWhereInput | InventoryMovementScalarWhereInput[]
    OR?: InventoryMovementScalarWhereInput[]
    NOT?: InventoryMovementScalarWhereInput | InventoryMovementScalarWhereInput[]
    id?: StringFilter<"InventoryMovement"> | string
    inventoryItemId?: StringFilter<"InventoryMovement"> | string
    delta?: DecimalFilter<"InventoryMovement"> | Decimal | DecimalJsLike | number | string
    reason?: StringFilter<"InventoryMovement"> | string
    orderId?: StringNullableFilter<"InventoryMovement"> | string | null
    createdAt?: DateTimeFilter<"InventoryMovement"> | Date | string
  }

  export type MenuItemCreateWithoutRecipeInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    category: MenuCategoryCreateNestedOneWithoutItemsInput
    station: KitchenStationCreateNestedOneWithoutMenuItemsInput
    orderItems?: OrderItemCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemUncheckedCreateWithoutRecipeInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    categoryId: string
    stationId: string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemCreateOrConnectWithoutRecipeInput = {
    where: MenuItemWhereUniqueInput
    create: XOR<MenuItemCreateWithoutRecipeInput, MenuItemUncheckedCreateWithoutRecipeInput>
  }

  export type InventoryItemCreateWithoutRecipesInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier?: SupplierCreateNestedOneWithoutInventoryItemsInput
    movements?: InventoryMovementCreateNestedManyWithoutInventoryItemInput
  }

  export type InventoryItemUncheckedCreateWithoutRecipesInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    supplierId?: string | null
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    movements?: InventoryMovementUncheckedCreateNestedManyWithoutInventoryItemInput
  }

  export type InventoryItemCreateOrConnectWithoutRecipesInput = {
    where: InventoryItemWhereUniqueInput
    create: XOR<InventoryItemCreateWithoutRecipesInput, InventoryItemUncheckedCreateWithoutRecipesInput>
  }

  export type MenuItemUpsertWithoutRecipeInput = {
    update: XOR<MenuItemUpdateWithoutRecipeInput, MenuItemUncheckedUpdateWithoutRecipeInput>
    create: XOR<MenuItemCreateWithoutRecipeInput, MenuItemUncheckedCreateWithoutRecipeInput>
    where?: MenuItemWhereInput
  }

  export type MenuItemUpdateToOneWithWhereWithoutRecipeInput = {
    where?: MenuItemWhereInput
    data: XOR<MenuItemUpdateWithoutRecipeInput, MenuItemUncheckedUpdateWithoutRecipeInput>
  }

  export type MenuItemUpdateWithoutRecipeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: MenuCategoryUpdateOneRequiredWithoutItemsNestedInput
    station?: KitchenStationUpdateOneRequiredWithoutMenuItemsNestedInput
    orderItems?: OrderItemUpdateManyWithoutMenuItemNestedInput
  }

  export type MenuItemUncheckedUpdateWithoutRecipeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderItems?: OrderItemUncheckedUpdateManyWithoutMenuItemNestedInput
  }

  export type InventoryItemUpsertWithoutRecipesInput = {
    update: XOR<InventoryItemUpdateWithoutRecipesInput, InventoryItemUncheckedUpdateWithoutRecipesInput>
    create: XOR<InventoryItemCreateWithoutRecipesInput, InventoryItemUncheckedCreateWithoutRecipesInput>
    where?: InventoryItemWhereInput
  }

  export type InventoryItemUpdateToOneWithWhereWithoutRecipesInput = {
    where?: InventoryItemWhereInput
    data: XOR<InventoryItemUpdateWithoutRecipesInput, InventoryItemUncheckedUpdateWithoutRecipesInput>
  }

  export type InventoryItemUpdateWithoutRecipesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneWithoutInventoryItemsNestedInput
    movements?: InventoryMovementUpdateManyWithoutInventoryItemNestedInput
  }

  export type InventoryItemUncheckedUpdateWithoutRecipesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    supplierId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    movements?: InventoryMovementUncheckedUpdateManyWithoutInventoryItemNestedInput
  }

  export type InventoryItemCreateWithoutMovementsInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier?: SupplierCreateNestedOneWithoutInventoryItemsInput
    recipes?: RecipeIngredientCreateNestedManyWithoutInventoryItemInput
  }

  export type InventoryItemUncheckedCreateWithoutMovementsInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    supplierId?: string | null
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeIngredientUncheckedCreateNestedManyWithoutInventoryItemInput
  }

  export type InventoryItemCreateOrConnectWithoutMovementsInput = {
    where: InventoryItemWhereUniqueInput
    create: XOR<InventoryItemCreateWithoutMovementsInput, InventoryItemUncheckedCreateWithoutMovementsInput>
  }

  export type InventoryItemUpsertWithoutMovementsInput = {
    update: XOR<InventoryItemUpdateWithoutMovementsInput, InventoryItemUncheckedUpdateWithoutMovementsInput>
    create: XOR<InventoryItemCreateWithoutMovementsInput, InventoryItemUncheckedCreateWithoutMovementsInput>
    where?: InventoryItemWhereInput
  }

  export type InventoryItemUpdateToOneWithWhereWithoutMovementsInput = {
    where?: InventoryItemWhereInput
    data: XOR<InventoryItemUpdateWithoutMovementsInput, InventoryItemUncheckedUpdateWithoutMovementsInput>
  }

  export type InventoryItemUpdateWithoutMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneWithoutInventoryItemsNestedInput
    recipes?: RecipeIngredientUpdateManyWithoutInventoryItemNestedInput
  }

  export type InventoryItemUncheckedUpdateWithoutMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    supplierId?: NullableStringFieldUpdateOperationsInput | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeIngredientUncheckedUpdateManyWithoutInventoryItemNestedInput
  }

  export type OrderCreateWithoutTableInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    staff?: UserCreateNestedOneWithoutOrdersInput
    items?: OrderItemCreateNestedManyWithoutOrderInput
    tickets?: KitchenTicketCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutTableInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    staffId?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
    tickets?: KitchenTicketUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutTableInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutTableInput, OrderUncheckedCreateWithoutTableInput>
  }

  export type OrderCreateManyTableInputEnvelope = {
    data: OrderCreateManyTableInput | OrderCreateManyTableInput[]
    skipDuplicates?: boolean
  }

  export type OrderUpsertWithWhereUniqueWithoutTableInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutTableInput, OrderUncheckedUpdateWithoutTableInput>
    create: XOR<OrderCreateWithoutTableInput, OrderUncheckedCreateWithoutTableInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutTableInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutTableInput, OrderUncheckedUpdateWithoutTableInput>
  }

  export type OrderUpdateManyWithWhereWithoutTableInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutTableInput>
  }

  export type TableCreateWithoutOrdersInput = {
    id?: string
    name: string
    capacity: number
    occupancy?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TableUncheckedCreateWithoutOrdersInput = {
    id?: string
    name: string
    capacity: number
    occupancy?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TableCreateOrConnectWithoutOrdersInput = {
    where: TableWhereUniqueInput
    create: XOR<TableCreateWithoutOrdersInput, TableUncheckedCreateWithoutOrdersInput>
  }

  export type UserCreateWithoutOrdersInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrdersInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrdersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
  }

  export type OrderItemCreateWithoutOrderInput = {
    id?: string
    name: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: string | null
    menuItem: MenuItemCreateNestedOneWithoutOrderItemsInput
  }

  export type OrderItemUncheckedCreateWithoutOrderInput = {
    id?: string
    menuItemId: string
    name: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: string | null
  }

  export type OrderItemCreateOrConnectWithoutOrderInput = {
    where: OrderItemWhereUniqueInput
    create: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput>
  }

  export type OrderItemCreateManyOrderInputEnvelope = {
    data: OrderItemCreateManyOrderInput | OrderItemCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type KitchenTicketCreateWithoutOrderInput = {
    id?: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    station: KitchenStationCreateNestedOneWithoutTicketsInput
  }

  export type KitchenTicketUncheckedCreateWithoutOrderInput = {
    id?: string
    stationId: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KitchenTicketCreateOrConnectWithoutOrderInput = {
    where: KitchenTicketWhereUniqueInput
    create: XOR<KitchenTicketCreateWithoutOrderInput, KitchenTicketUncheckedCreateWithoutOrderInput>
  }

  export type KitchenTicketCreateManyOrderInputEnvelope = {
    data: KitchenTicketCreateManyOrderInput | KitchenTicketCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type TableUpsertWithoutOrdersInput = {
    update: XOR<TableUpdateWithoutOrdersInput, TableUncheckedUpdateWithoutOrdersInput>
    create: XOR<TableCreateWithoutOrdersInput, TableUncheckedCreateWithoutOrdersInput>
    where?: TableWhereInput
  }

  export type TableUpdateToOneWithWhereWithoutOrdersInput = {
    where?: TableWhereInput
    data: XOR<TableUpdateWithoutOrdersInput, TableUncheckedUpdateWithoutOrdersInput>
  }

  export type TableUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    occupancy?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TableUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    occupancy?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutOrdersInput = {
    update: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrdersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type UserUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OrderItemUpsertWithWhereUniqueWithoutOrderInput = {
    where: OrderItemWhereUniqueInput
    update: XOR<OrderItemUpdateWithoutOrderInput, OrderItemUncheckedUpdateWithoutOrderInput>
    create: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput>
  }

  export type OrderItemUpdateWithWhereUniqueWithoutOrderInput = {
    where: OrderItemWhereUniqueInput
    data: XOR<OrderItemUpdateWithoutOrderInput, OrderItemUncheckedUpdateWithoutOrderInput>
  }

  export type OrderItemUpdateManyWithWhereWithoutOrderInput = {
    where: OrderItemScalarWhereInput
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyWithoutOrderInput>
  }

  export type KitchenTicketUpsertWithWhereUniqueWithoutOrderInput = {
    where: KitchenTicketWhereUniqueInput
    update: XOR<KitchenTicketUpdateWithoutOrderInput, KitchenTicketUncheckedUpdateWithoutOrderInput>
    create: XOR<KitchenTicketCreateWithoutOrderInput, KitchenTicketUncheckedCreateWithoutOrderInput>
  }

  export type KitchenTicketUpdateWithWhereUniqueWithoutOrderInput = {
    where: KitchenTicketWhereUniqueInput
    data: XOR<KitchenTicketUpdateWithoutOrderInput, KitchenTicketUncheckedUpdateWithoutOrderInput>
  }

  export type KitchenTicketUpdateManyWithWhereWithoutOrderInput = {
    where: KitchenTicketScalarWhereInput
    data: XOR<KitchenTicketUpdateManyMutationInput, KitchenTicketUncheckedUpdateManyWithoutOrderInput>
  }

  export type OrderCreateWithoutItemsInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    table?: TableCreateNestedOneWithoutOrdersInput
    staff?: UserCreateNestedOneWithoutOrdersInput
    tickets?: KitchenTicketCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutItemsInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    tableId?: string | null
    staffId?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: KitchenTicketUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutItemsInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
  }

  export type MenuItemCreateWithoutOrderItemsInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    category: MenuCategoryCreateNestedOneWithoutItemsInput
    station: KitchenStationCreateNestedOneWithoutMenuItemsInput
    recipe?: RecipeIngredientCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemUncheckedCreateWithoutOrderItemsInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    categoryId: string
    stationId: string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    recipe?: RecipeIngredientUncheckedCreateNestedManyWithoutMenuItemInput
  }

  export type MenuItemCreateOrConnectWithoutOrderItemsInput = {
    where: MenuItemWhereUniqueInput
    create: XOR<MenuItemCreateWithoutOrderItemsInput, MenuItemUncheckedCreateWithoutOrderItemsInput>
  }

  export type OrderUpsertWithoutItemsInput = {
    update: XOR<OrderUpdateWithoutItemsInput, OrderUncheckedUpdateWithoutItemsInput>
    create: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutItemsInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutItemsInput, OrderUncheckedUpdateWithoutItemsInput>
  }

  export type OrderUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    table?: TableUpdateOneWithoutOrdersNestedInput
    staff?: UserUpdateOneWithoutOrdersNestedInput
    tickets?: KitchenTicketUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: KitchenTicketUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type MenuItemUpsertWithoutOrderItemsInput = {
    update: XOR<MenuItemUpdateWithoutOrderItemsInput, MenuItemUncheckedUpdateWithoutOrderItemsInput>
    create: XOR<MenuItemCreateWithoutOrderItemsInput, MenuItemUncheckedCreateWithoutOrderItemsInput>
    where?: MenuItemWhereInput
  }

  export type MenuItemUpdateToOneWithWhereWithoutOrderItemsInput = {
    where?: MenuItemWhereInput
    data: XOR<MenuItemUpdateWithoutOrderItemsInput, MenuItemUncheckedUpdateWithoutOrderItemsInput>
  }

  export type MenuItemUpdateWithoutOrderItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: MenuCategoryUpdateOneRequiredWithoutItemsNestedInput
    station?: KitchenStationUpdateOneRequiredWithoutMenuItemsNestedInput
    recipe?: RecipeIngredientUpdateManyWithoutMenuItemNestedInput
  }

  export type MenuItemUncheckedUpdateWithoutOrderItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipe?: RecipeIngredientUncheckedUpdateManyWithoutMenuItemNestedInput
  }

  export type OrderCreateWithoutTicketsInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    table?: TableCreateNestedOneWithoutOrdersInput
    staff?: UserCreateNestedOneWithoutOrdersInput
    items?: OrderItemCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutTicketsInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    tableId?: string | null
    staffId?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutTicketsInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutTicketsInput, OrderUncheckedCreateWithoutTicketsInput>
  }

  export type KitchenStationCreateWithoutTicketsInput = {
    id?: string
    name: string
    printer?: string | null
    active?: boolean
    color?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    menuItems?: MenuItemCreateNestedManyWithoutStationInput
  }

  export type KitchenStationUncheckedCreateWithoutTicketsInput = {
    id?: string
    name: string
    printer?: string | null
    active?: boolean
    color?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    menuItems?: MenuItemUncheckedCreateNestedManyWithoutStationInput
  }

  export type KitchenStationCreateOrConnectWithoutTicketsInput = {
    where: KitchenStationWhereUniqueInput
    create: XOR<KitchenStationCreateWithoutTicketsInput, KitchenStationUncheckedCreateWithoutTicketsInput>
  }

  export type OrderUpsertWithoutTicketsInput = {
    update: XOR<OrderUpdateWithoutTicketsInput, OrderUncheckedUpdateWithoutTicketsInput>
    create: XOR<OrderCreateWithoutTicketsInput, OrderUncheckedCreateWithoutTicketsInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutTicketsInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutTicketsInput, OrderUncheckedUpdateWithoutTicketsInput>
  }

  export type OrderUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    table?: TableUpdateOneWithoutOrdersNestedInput
    staff?: UserUpdateOneWithoutOrdersNestedInput
    items?: OrderItemUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type KitchenStationUpsertWithoutTicketsInput = {
    update: XOR<KitchenStationUpdateWithoutTicketsInput, KitchenStationUncheckedUpdateWithoutTicketsInput>
    create: XOR<KitchenStationCreateWithoutTicketsInput, KitchenStationUncheckedCreateWithoutTicketsInput>
    where?: KitchenStationWhereInput
  }

  export type KitchenStationUpdateToOneWithWhereWithoutTicketsInput = {
    where?: KitchenStationWhereInput
    data: XOR<KitchenStationUpdateWithoutTicketsInput, KitchenStationUncheckedUpdateWithoutTicketsInput>
  }

  export type KitchenStationUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    printer?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    menuItems?: MenuItemUpdateManyWithoutStationNestedInput
  }

  export type KitchenStationUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    printer?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    menuItems?: MenuItemUncheckedUpdateManyWithoutStationNestedInput
  }

  export type SessionCreateManyUserInput = {
    id?: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type OrderCreateManyStaffInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    tableId?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUpdateWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    table?: TableUpdateOneWithoutOrdersNestedInput
    items?: OrderItemUpdateManyWithoutOrderNestedInput
    tickets?: KitchenTicketUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
    tickets?: KitchenTicketUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateManyWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MenuItemCreateManyStationInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    categoryId: string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KitchenTicketCreateManyStationInput = {
    id?: string
    orderId: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MenuItemUpdateWithoutStationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: MenuCategoryUpdateOneRequiredWithoutItemsNestedInput
    recipe?: RecipeIngredientUpdateManyWithoutMenuItemNestedInput
    orderItems?: OrderItemUpdateManyWithoutMenuItemNestedInput
  }

  export type MenuItemUncheckedUpdateWithoutStationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipe?: RecipeIngredientUncheckedUpdateManyWithoutMenuItemNestedInput
    orderItems?: OrderItemUncheckedUpdateManyWithoutMenuItemNestedInput
  }

  export type MenuItemUncheckedUpdateManyWithoutStationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KitchenTicketUpdateWithoutStationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutTicketsNestedInput
  }

  export type KitchenTicketUncheckedUpdateWithoutStationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KitchenTicketUncheckedUpdateManyWithoutStationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MenuItemCreateManyCategoryInput = {
    id?: string
    name: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    sku?: string | null
    available?: boolean
    posVisible?: boolean
    popular?: boolean
    prepTimeMinutes?: number | null
    image?: string | null
    stationId: string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MenuItemUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    station?: KitchenStationUpdateOneRequiredWithoutMenuItemsNestedInput
    recipe?: RecipeIngredientUpdateManyWithoutMenuItemNestedInput
    orderItems?: OrderItemUpdateManyWithoutMenuItemNestedInput
  }

  export type MenuItemUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: StringFieldUpdateOperationsInput | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipe?: RecipeIngredientUncheckedUpdateManyWithoutMenuItemNestedInput
    orderItems?: OrderItemUncheckedUpdateManyWithoutMenuItemNestedInput
  }

  export type MenuItemUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    available?: BoolFieldUpdateOperationsInput | boolean
    posVisible?: BoolFieldUpdateOperationsInput | boolean
    popular?: BoolFieldUpdateOperationsInput | boolean
    prepTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: StringFieldUpdateOperationsInput | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipeIngredientCreateManyMenuItemInput = {
    id?: string
    inventoryItemId: string
    quantity: Decimal | DecimalJsLike | number | string
    unit: string
  }

  export type OrderItemCreateManyMenuItemInput = {
    id?: string
    orderId: string
    name: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: string | null
  }

  export type RecipeIngredientUpdateWithoutMenuItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    inventoryItem?: InventoryItemUpdateOneRequiredWithoutRecipesNestedInput
  }

  export type RecipeIngredientUncheckedUpdateWithoutMenuItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryItemId?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
  }

  export type RecipeIngredientUncheckedUpdateManyWithoutMenuItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryItemId?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
  }

  export type OrderItemUpdateWithoutMenuItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
    order?: OrderUpdateOneRequiredWithoutItemsNestedInput
  }

  export type OrderItemUncheckedUpdateWithoutMenuItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderItemUncheckedUpdateManyWithoutMenuItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryItemCreateManySupplierInput = {
    id?: string
    name: string
    sku: string
    category: string
    unit: string
    stock: Decimal | DecimalJsLike | number | string
    reorderLevel: Decimal | DecimalJsLike | number | string
    costPerUnit: Decimal | DecimalJsLike | number | string
    lastRestocked?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryItemUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeIngredientUpdateManyWithoutInventoryItemNestedInput
    movements?: InventoryMovementUpdateManyWithoutInventoryItemNestedInput
  }

  export type InventoryItemUncheckedUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeIngredientUncheckedUpdateManyWithoutInventoryItemNestedInput
    movements?: InventoryMovementUncheckedUpdateManyWithoutInventoryItemNestedInput
  }

  export type InventoryItemUncheckedUpdateManyWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    stock?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reorderLevel?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPerUnit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipeIngredientCreateManyInventoryItemInput = {
    id?: string
    menuItemId: string
    quantity: Decimal | DecimalJsLike | number | string
    unit: string
  }

  export type InventoryMovementCreateManyInventoryItemInput = {
    id?: string
    delta: Decimal | DecimalJsLike | number | string
    reason: string
    orderId?: string | null
    createdAt?: Date | string
  }

  export type RecipeIngredientUpdateWithoutInventoryItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    menuItem?: MenuItemUpdateOneRequiredWithoutRecipeNestedInput
  }

  export type RecipeIngredientUncheckedUpdateWithoutInventoryItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    menuItemId?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
  }

  export type RecipeIngredientUncheckedUpdateManyWithoutInventoryItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    menuItemId?: StringFieldUpdateOperationsInput | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
  }

  export type InventoryMovementUpdateWithoutInventoryItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    delta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryMovementUncheckedUpdateWithoutInventoryItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    delta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryMovementUncheckedUpdateManyWithoutInventoryItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    delta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateManyTableInput = {
    id?: string
    number: string
    status: $Enums.OrderStatus
    channel: string
    customerName?: string | null
    customerPhone?: string | null
    staffId?: string | null
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    tip?: Decimal | DecimalJsLike | number | string | null
    discount?: Decimal | DecimalJsLike | number | string | null
    total: Decimal | DecimalJsLike | number | string
    payment: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateWithoutTableInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    staff?: UserUpdateOneWithoutOrdersNestedInput
    items?: OrderItemUpdateManyWithoutOrderNestedInput
    tickets?: KitchenTicketUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutTableInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
    tickets?: KitchenTicketUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateManyWithoutTableInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    channel?: StringFieldUpdateOperationsInput | string
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderItemCreateManyOrderInput = {
    id?: string
    menuItemId: string
    name: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: string | null
  }

  export type KitchenTicketCreateManyOrderInput = {
    id?: string
    stationId: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderItemUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
    menuItem?: MenuItemUpdateOneRequiredWithoutOrderItemsNestedInput
  }

  export type OrderItemUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    menuItemId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderItemUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    menuItemId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    modifiers?: NullableJsonNullValueInput | InputJsonValue
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KitchenTicketUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    station?: KitchenStationUpdateOneRequiredWithoutTicketsNestedInput
  }

  export type KitchenTicketUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KitchenTicketUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    stationId?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}