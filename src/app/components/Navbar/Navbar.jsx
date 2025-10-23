"use client";

import * as React from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Define the ListItem component first to avoid potential hoisting issues
const ListItem = React.forwardRef((props, ref) => {
    const { className, title, children, ...rest } = props;

    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...rest}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});

ListItem.displayName = "ListItem";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full bg-blurred/50">
            <div className="container mx-auto flex h-14 items-center justify-between">
                <div className="flex justify-between w-full items-center">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            <img src="https://i.ibb.co.com/1YY84nCt/image.png" alt="logo" className="w-16 h-16" />
                        </span>
                    </Link>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Work</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <a
                                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                    href="/work"
                                                >
                                                    <div className="mb-2 mt-4 text-lg font-medium">
                                                        Our Work
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground">
                                                        Explore our portfolio of successful projects and case studies.
                                                    </p>
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem href="/work/scenarios" title="Work Scenarios">
                                            Different approaches to various project types
                                        </ListItem>
                                        <ListItem href="/work/quality" title="Quality Standards">
                                            Our commitment to excellence
                                        </ListItem>
                                        <ListItem href="/work/process" title="How We Work">
                                            Our development methodology
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        <ListItem href="/services/technologies" title="Technologies">
                                            Our tech stack and expertise
                                        </ListItem>
                                        <ListItem href="/services/process" title="Dev Process">
                                            Our development lifecycle
                                        </ListItem>
                                        <ListItem href="/services/pricing" title="Pricing">
                                            Our pricing models and packages
                                        </ListItem>
                                        <ListItem href="/services/case-studies" title="Case Studies">
                                            Success stories from our clients
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Design</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        <ListItem href="/design/ui" title="UI Design">
                                            User interface design services
                                        </ListItem>
                                        <ListItem href="/design/ux" title="UX Research">
                                            User experience research and testing
                                        </ListItem>
                                        <ListItem href="/design/branding" title="Branding">
                                            Brand identity and design systems
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/faq" className={cn(navigationMenuTriggerStyle(), "group")}>
                                        FAQ
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/contact" className={cn(navigationMenuTriggerStyle(), "group")}>
                                        E-mail
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
    <NavigationMenuLink asChild>
        <Link href="/about" className={cn(navigationMenuTriggerStyle(), "group")}>
            About 
        </Link>
    </NavigationMenuLink>
</NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header>
    );
}