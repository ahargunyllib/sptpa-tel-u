import type { LabelHTMLAttributes } from "react";

export default function InputLabel({
	value,
	className = "",
	children,
	...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
		<label
			{...props}
			className={
				// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
				// biome-ignore lint/style/useTemplate: <explanation>
				`block text-sm font-medium text-gray-700 ` + className
			}
		>
			{value ? value : children}
		</label>
	);
}
