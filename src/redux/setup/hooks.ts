'use client'
import type { ChangeEvent } from 'react';
import { useEffect, useRef } from 'react';
import {type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, AppState } from './store';

export const useForm =  
    <TContent>(defaultValues: TContent) =>
    (handler: (content: TContent) => void) =>
    async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.persist();

        const form = event.target as HTMLFormElement;
        const elements = Array.from(form.elements) as HTMLInputElement[];
        const data = elements
            .filter((element) => element.hasAttribute('name'))
            .reduce(
                (object, element) => ({
                    ...object,
                    [`${element.getAttribute('name')}`]: element.value,
                }),
                defaultValues,
            );
        await handler(data);
        form.reset();
    };

type IntervalCallback = (...args: unknown[]) => void

export const useInterval = (callback: IntervalCallback, delay: number | null) => {
    const savedCallback = useRef<IntervalCallback | null>(null);
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        const handler = (...args: unknown[]) => savedCallback.current?.(...args);

        if (delay !== null) {
            const id = setInterval(handler, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
