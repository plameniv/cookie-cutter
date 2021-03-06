/*
Copyright (c) Walmart Inc.

This source code is licensed under the Apache 2.0 license found in the
LICENSE file in the root directory of this source tree.
*/

import { ILogger, IMessage, IMetrics, ITracing, StateRef } from ".";

export interface IClassType<T> {
    new (...args): T;
    readonly name: string;
}

export interface IDispatchState<TState> {
    get(key: string, atSn?: number): Promise<StateRef<TState>>;
    compute(): Array<StateRef<TState>>;
    compute(key: string): StateRef<TState> | undefined;
}

export interface IDispatchContext<TState = any> {
    metadata<T>(key: string): T;
    publish<T>(type: IClassType<T>, msg: T, meta?: Readonly<{ [key in string]: any }>): void;
    store<T>(type: IClassType<T>, state: StateRef<TState>, msg: T): void;
    typeName<T>(type: IClassType<T>): string;
    readonly services: IServiceRegistry;
    readonly state: IDispatchState<TState>;
    readonly metrics: IMetrics;
    readonly logger: ILogger;
    readonly trace: ITracing;
    bail: (err: any) => never;
}

export interface IMessageDispatcher {
    canDispatch(msg: IMessage): boolean;
    dispatch(msg: IMessage, ctx: IDispatchContext): Promise<any>;
}

export interface IServiceRegistry {
    get<T>(serviceName: string): T;
}

export function isMessageDispatcher(obj: any): obj is IMessageDispatcher {
    return obj !== undefined && obj.canDispatch !== undefined && obj.dispatch !== undefined;
}
