"use client"; // Mark the component as a client component

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Category } from "@/types/category";
import { apiClient } from "@/lib/apiClient";

export function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories data on the client side
    apiClient
      .get(`/api/categories`)
      .then((response) => setCategories(response.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div>Error loading categories: {error}</div>;
  }

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {categories.map((category: Category) => (
          <NavigationMenuItem key={category.id}>
            <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/categories/${subcategory.id}`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {subcategory.name}
                        </div>
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
  );
}
