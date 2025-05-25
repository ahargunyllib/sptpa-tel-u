import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type ConfirmationModalProps<T = void> = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: T extends void ? () => void : (data: T) => void;
	data?: T;
	trigger?: React.ReactNode;
};

export function ConfirmationModal<T = void>({
	title = "Are you sure?",
	description = "This action cannot be undone.",
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	data,
	trigger,
}: ConfirmationModalProps<T>) {
	const [open, setOpen] = useState(false);

	const handleConfirm = () => {
		if (data !== undefined) {
			(onConfirm as (data: T) => void)(data);
		} else {
			(onConfirm as () => void)();
		}
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ?? <Button variant="destructive">Open Confirmation</Button>}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="ghost" onClick={() => setOpen(false)}>
						{cancelText}
					</Button>
					<Button variant="destructive" onClick={handleConfirm}>
						{confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
