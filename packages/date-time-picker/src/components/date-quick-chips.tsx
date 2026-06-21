import type { QuickDateOption } from '../lib/quick-dates';
import { cn } from '../lib/utils';

type DateQuickChipsProps = {
	options: QuickDateOption[];
	isSelected: (date: Date) => boolean;
	onSelect: (date: Date) => void;
};

export function DateQuickChips({
	options,
	isSelected,
	onSelect,
}: DateQuickChipsProps) {
	return (
		<div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{options.map((option) => {
				const active = isSelected(option.date);
				return (
					<button
						key={option.id}
						type="button"
						onClick={() => onSelect(option.date)}
						className={cn(
							'flex-shrink-0 rounded-xl border px-5 py-2.5 text-left transition-all active:scale-95',
							active
								? 'border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20'
								: 'border-border bg-background hover:bg-accent',
						)}
					>
						<span
							className={cn(
								'block text-[10px] font-bold uppercase tracking-widest',
								active ? 'text-primary-foreground/80' : 'text-muted-foreground',
							)}
						>
							{option.label}
						</span>
						<span className="block text-sm font-semibold">{option.sublabel}</span>
					</button>
				);
			})}
		</div>
	);
}
