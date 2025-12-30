interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}

type GetSerializedErrorType<ThunkApiConfig> = ThunkApiConfig extends {
  serializedErrorType: infer GetSerializedErrorTypeAlias;
}
  ? GetSerializedErrorTypeAlias
  : SerializedError;

type GetRejectedMeta<ThunkApiConfig> = ThunkApiConfig extends {
  rejectedMeta: infer RejectedMeta;
}
  ? RejectedMeta
  : unknown;

type GetRejectValue<ThunkApiConfig> = ThunkApiConfig extends {
  rejectValue: infer RejectValue;
}
  ? RejectValue
  : unknown;

type GetFulfilledMeta<ThunkApiConfig> = ThunkApiConfig extends {
  fulfilledMeta: infer FulfilledMeta;
}
  ? FulfilledMeta
  : unknown;

type PayloadAction<P = void, T extends string = string, M = never, E = never> = {
  payload: P;
  type: T;
} & ([M] extends [never]
  ? {}
  : {
      meta: M;
    }) &
  ([E] extends [never]
    ? {}
    : {
        error: E;
      });

interface BaseActionCreator<P, T extends string, M = never, E = never> {
  type: T;
  match: (action: unknown) => action is PayloadAction<P, T, M, E>;
}

interface ActionCreatorWithPreparedPayload<
  Args extends unknown[],
  P,
  T extends string = string,
  E = never,
  M = never
> extends BaseActionCreator<P, T, M, E> {
  /**
   * Calling this {@link redux#ActionCreator} with `Args` will return
   * an Action with a payload of type `P` and (depending on the `PrepareAction`
   * method used) a `meta`- and `error` property of types `M` and `E` respectively.
   */
  (...args: Args): PayloadAction<P, T, M, E>;
}

export type AsyncThunkFulfilledActionCreator<
  Returned,
  ThunkArg,
  ThunkApiConfig = {}
> = ActionCreatorWithPreparedPayload<
  [Returned, string, ThunkArg, GetFulfilledMeta<ThunkApiConfig>?],
  Returned,
  string,
  never,
  {
    arg: ThunkArg;
    requestId: string;
    requestStatus: 'fulfilled';
  } & GetFulfilledMeta<ThunkApiConfig>
>;

export type AsyncThunkRejectedActionCreator<
  ThunkArg,
  ThunkApiConfig = {}
> = ActionCreatorWithPreparedPayload<
  [
    Error | null,
    string,
    ThunkArg,
    GetRejectValue<ThunkApiConfig>?,
    GetRejectedMeta<ThunkApiConfig>?
  ],
  GetRejectValue<ThunkApiConfig> | undefined,
  string,
  GetSerializedErrorType<ThunkApiConfig>,
  {
    arg: ThunkArg;
    requestId: string;
    requestStatus: 'rejected';
    aborted: boolean;
    condition: boolean;
  } & (
    | ({ rejectedWithValue: false } & {
        [K in keyof GetRejectedMeta<ThunkApiConfig>]?: undefined;
      })
    | ({ rejectedWithValue: true } & GetRejectedMeta<ThunkApiConfig>)
  )
>;

export enum APIErrorType {
  USER_CANCELLED_REQUEST = 'USER_CANCELLED_REQUEST',
}
