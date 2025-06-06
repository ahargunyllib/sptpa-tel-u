import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-12 w-full text-dark-100 rounded-md border border-input bg-light-40 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

const LabelInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
	return (
		<Input
			className={cn(
				"disabled:bg-transparent disabled:border-none disabled:opacity-100 disabled:cursor-default bg-transparent disabled:shadow-none text-center",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});

export { Input, LabelInput };
