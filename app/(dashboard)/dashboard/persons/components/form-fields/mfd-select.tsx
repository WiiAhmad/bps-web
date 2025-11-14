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
import { getAllMFD } from '@/lib/db/query';

interface MFDSelectProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

interface MFDOption {
  id: number;
  label: string;
  searchText: string;
}

export function MFDSelect({ value, onChange, error }: MFDSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<MFDOption[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadMFD() {
      try {
        setLoading(true);
        const mfdData = await getAllMFD();
        const formattedOptions = mfdData.map((mfd) => ({
          id: mfd.id,
          label: `${mfd.namaProvinsi} - ${mfd.namaKabupaten} - ${mfd.namaDesa}`,
          searchText: `${mfd.namaProvinsi} ${mfd.namaKabupaten} ${mfd.namaKecamatan} ${mfd.namaDesa} ${mfd.namaDusun} ${mfd.namaSLS} ${mfd.namaSubSLS}`.toLowerCase(),
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Failed to load MFD data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMFD();
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
                Loading locations...
              </span>
            ) : selectedOption ? (
              selectedOption.label
            ) : (
              'Select MFD location...'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search location..." />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
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
