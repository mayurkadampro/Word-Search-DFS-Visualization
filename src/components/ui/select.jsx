import * as React from "react";

const Select = React.forwardRef(({ className, onChange, disabled, ...props }, ref) => {
  return (
    <select
      disabled={disabled}
      onChange={onChange}
      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      ref={ref}
      {...props}
    />
  );
});
Select.displayName = "Select";

export { Select };
