"use client"

import * as React from "react"
import {Check, ChevronsUpDown} from "lucide-react"

import {cn, fixedForwardRef} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem, CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {ForwardedRef, ReactNode, useEffect, useImperativeHandle} from "react";

export type ComboboxHandle<T> = {
    getSelected: () => T | undefined;
};

export interface ComboboxProps<T> {
    getItems: (search: string) => Promise<T[]>
    getItemKey: (item: T) => string;
    getItemLabel: (item: T) => string;
    onSelect?: (value?: T) => any;
    renderInList?: (value: T) => ReactNode;
    renderSelected?: (value: T) => ReactNode;
    selectPlaceholder?: string;
    searchPlaceholder?: string;
    noItemsText?: string;
    buttonClassName?: string;
    contentClassName?: string;
}

export const Combobox = fixedForwardRef(ComboboxInternal);

function ComboboxInternal<T>(props: ComboboxProps<T>, ref: ForwardedRef<ComboboxHandle<T>>) {
    const [open, setOpen] = React.useState(false)
    const [items, setItems] = React.useState<T[]>([])
    const [loadingItems, setLoadingItems] = React.useState(false)
    const [selected, setSelected] = React.useState<T | undefined>(undefined)
    const [search, setSearch] = React.useState('')

    useEffect(() => {
        if (!open) return;
        setLoadingItems(true)
        props.getItems(search).then((items) => {
            console.log("Loaded items", items)
            setItems(items)
            setLoadingItems(false)
        }).catch((e) => {
            setItems([])
            console.error(`Failed to load items with search ${search}`, e)
        }).finally(() => {
            setLoadingItems(false)
        })
    }, [open, search])

    useImperativeHandle(ref, () => {
        return {
            getSelected() {
                return selected;
            }
        }
    });

    function onSearchChange(value: string) {
        setSearch(value)
    }

    function onSelect(newKey: string) {
        const newItem = items.find((item) => props.getItemKey(item) === newKey)
        console.log("Selected", newKey, newItem, items)
        let newSelected = newItem
        if (!selected) {
            setSelected(newItem)
        } else {
            if (props.getItemKey(selected) === newKey) {
                setSelected(undefined);
                newSelected = undefined;
            } else {
                setSelected(newItem)
            }
        }
        props.onSelect?.(newSelected)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(["w-auto min-w-[120px] justify-between", props.buttonClassName])}
                >
                    {selected ? props.getItemLabel(selected) : <span className="opacity-50">{props.selectPlaceholder}</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn(["w-full p-0", props.contentClassName])}>
                <Command shouldFilter={false}>
                    <CommandInput placeholder={props.searchPlaceholder} value={search} onValueChange={onSearchChange}
                                  loading={loadingItems}/>
                    <CommandEmpty>{props.noItemsText}</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={props.getItemKey(item)}
                                    value={props.getItemKey(item)}
                                    onSelect={onSelect}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            (selected && props.getItemKey(selected) === props.getItemKey(item)) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {props.renderInList?.(item) ?? props.getItemLabel(item)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
