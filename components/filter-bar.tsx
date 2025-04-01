import { ChevronDown } from 'lucide-react';

export function FilterBar() {
	// Static filter options
	const platformFilter = 'All Platforms';
	const genreFilter = 'All genres';
	const featuresFilter = 'Features';
	const sortBy = 'Popular';

	return (
		<div className="flex flex-wrap justify-between mb-6 gap-2">
			<div className="flex flex-wrap gap-2">
				<div className="dropdown-container relative">
					<button className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-full text-sm">
						{platformFilter}
						<ChevronDown size={16} />
					</button>
				</div>

				<div className="dropdown-container relative">
					<button className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-full text-sm">
						{genreFilter}
						<ChevronDown size={16} />
					</button>
				</div>

				<div className="dropdown-container relative">
					<button className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-full text-sm">
						{featuresFilter}
						<ChevronDown size={16} />
					</button>
				</div>
			</div>

			<div className="dropdown-container relative">
				<button className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-full text-sm">
					Sort by: {sortBy}
					<ChevronDown size={16} />
				</button>
			</div>
		</div>
	);
}
