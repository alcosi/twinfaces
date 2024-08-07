'use client'

import {usePathname} from "next/navigation";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {PathLinkMode} from "@/components/layout/layoutlink.common";

interface PathLinkProps {
    href: string;
    children: React.ReactNode;
    mode: PathLinkMode;
    className?: string;
    enabledClassName?: string;
    disabledClassName?: string;
}

export function PathLink({href, children, mode, className, enabledClassName, disabledClassName}: PathLinkProps) {
    const pathname = usePathname();
    console.log(pathname, href);
    let isActive = false;
    if (mode === PathLinkMode.Exact) {
        isActive = pathname === href;
    } else if (mode === PathLinkMode.StartsWith) {
        isActive = pathname.startsWith(href);
    }

    return <Link href={href} className={cn(className, isActive && enabledClassName, !isActive && disabledClassName)}>
        {children}
    </Link>
}