"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // При монтировании пытаемся загрузить выбранный город из localStorage
  React.useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
      const found = teams.find((team) => team.name === storedCity);
      if (found) {
        setValue(found.name);
      }
    }
  }, [teams]);

  const handleSelect = (currentValue: string, team: typeof teams[0]) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);
    // Сохраняем выбранный город в localStorage
    localStorage.setItem("selectedCity", team.name);
  };

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="flex flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              isCollapsed ? "w-[30px]" : "w-[200px]",
              "justify-center" // Центрируем содержимое
            )}
            onClick={() => setOpen(!open)}
          >
            {isCollapsed ? (
              <MapPin className="w-6 h-6" />
            ) : (
              <>
                {value || "Выбери город"}
                <ChevronsUpDown className="opacity-50 ml-2" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Выбери город" className="h-9" />
            <CommandList>
              <CommandEmpty>Город не найден.</CommandEmpty>
              <CommandGroup>
                {teams.map((team) => (
                  <CommandItem
                    key={team.name}
                    value={team.name}
                    onSelect={(currentValue) => handleSelect(currentValue, team)}
                  >
                    {team.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === team.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
        <DropdownMenuSeparator />
      </DropdownMenu>
    </div>
  );
}
