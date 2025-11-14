'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getAllUsers } from '@/lib/db/query';

interface UserSelectProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

interface UserOption {
  id: number;
  label: string;
  searchText: string;
}

export function UserSelect({ value, onChange, error }: UserSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<UserOption[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const users = await getAllUsers();
        const formattedOptions = users.map((user) => ({
          id: user.id,
          label: `${user.nama} (${user.username})`,
          searchText: `${user.nama} ${user.username}`.toLowerCase(),
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const selectedOption = options.find((option) => option.id === value);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              error && 'border-red-500',
              !value && 'text-muted-foreground'
            )}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading users...
              </span>
            ) : selectedOption ? (
              selectedOption.label
            ) : (
              'Select user...'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.searchText}
                    onSelect={() => {
                      onChange(option.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
