"use client";
import { useEffect, useState } from "react";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import type { ChangeEvent } from "react";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [debounceValue] = useDebounceValue(value, 500);

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          search: debounceValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debounceValue, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground h-4 w-4" />
      <Input
        className="pl-9 w-full max-w-[510px]"
        placeholder="请输入"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};

export default SearchInput;
