"use client"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const categories = {
  News: ["Politics", "World", "Local", "Business"],
  Sports: ["Football", "Basketball", "Swimming", "Athletics"],
  Entertainment: ["Movies", "Music", "Celebrity", "Culture"],
  Technology: ["Gadgets", "Software", "Startups", "AI"],
  Lifestyle: ["Health", "Food", "Travel", "Fashion"],
}

export function Navbar() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {Object.entries(categories).map(([category, subcategories]) => (
          <NavigationMenuItem key={category}>
            <NavigationMenuTrigger>{category}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                {subcategories.map((subcategory) => (
                  <li key={subcategory}>
                    <NavigationMenuLink asChild>
                      <Link
                        href="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">{subcategory}</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

