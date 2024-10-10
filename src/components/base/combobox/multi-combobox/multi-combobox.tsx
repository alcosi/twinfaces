"use client"

import { Button } from "@/components/base/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem, CommandList,
} from "@/components/base/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/base/popover"
import { cn, fixedForwardRef } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import {
    ForwardedRef,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useState
} from "react"
import { SelectedOptions } from "./selected-options"

export type MultiComboboxHandle<T> = {
    setSelected: (newSelected: T[]) => void;
};

export interface MultiComboboxProps<T> {
    getItems: (search: string) => Promise<T[]>
    getItemKey: (item: T) => string;
    getItemLabel: (item: T) => string;
    onSelect?: (value?: T[]) => any;
    renderInList?: (value: T) => ReactNode;
    renderSelected?: (value: T) => ReactNode;
    selectPlaceholder?: string;
    searchPlaceholder?: string;
    noItemsText?: string;
    buttonClassName?: string;
    contentClassName?: string;
    multi?: boolean
}

export const MultiCombobox = fixedForwardRef(ComboboxInternal);

function ComboboxInternal<T>(
    props: MultiComboboxProps<T>,
    ref: ForwardedRef<MultiComboboxHandle<T>>
) {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<T[]>([])
    const [loadingItems, setLoadingItems] = useState(false)
    const [selected, setSelected] = useState<T[]>([]);
    const [search, setSearch] = useState('')

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
            setSelected(newSelected: T[]) {
                setSelected(newSelected)
            }
        }
    }, []);

    function onSearchChange(value: string) {
        setSearch(value)
    }

    function handleOnSelect(newKey: string) {
        const newItem = items.find((item) => props.getItemKey(item) === newKey)
        if (!newItem) return;

        const newSelected = selected.some(item => props.getItemKey(item) === newKey)
            ? selected.filter(item => props.getItemKey(item) !== newKey)
            : [...selected, newItem];

        setSelected(newSelected);
        props.onSelect?.(newSelected);
        setOpen(false);
    }
    

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex w-auto min-w-[120px] h-auto min-h-10 justify-between",
                        props.buttonClassName
                    )}
                >
                    <SelectedOptions
                        selected={selected}
                        getItemKey={props.getItemKey}
                        getItemLabel={props.getItemLabel}
                        onChange={(newSelected) => {
                            setSelected(newSelected);
                            props.onSelect?.(newSelected);
                        }}
                        placeholder={props.selectPlaceholder}
                        multi={props.multi}
                    />
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn(["w-full p-0", props.contentClassName])}>
                <Command shouldFilter={false}>
                    <CommandInput placeholder={props.searchPlaceholder} value={search} onValueChange={onSearchChange}
                        loading={loadingItems} />
                    <CommandEmpty>{props.noItemsText}</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={props.getItemKey(item)}
                                    value={props.getItemKey(item)}
                                    onSelect={handleOnSelect}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.some(selectedItem => props.getItemKey(selectedItem) === props.getItemKey(item)) ? "opacity-100" : "opacity-0"
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