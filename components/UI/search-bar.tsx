import { Search } from 'lucide-react';

export const SearchBar = () => (
	<div className="hidden sm:block relative">
		<form>
			<input
				type="text"
				placeholder="Search games..."
				className="bg-gray-100 rounded-full pl-10 pr-4 py-1.5 w-40 md:w-48 lg:w-64 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-gray-50 transition-all"
				aria-label="Search games"
				readOnly // <- makes input non-editable
			/>
			<Search
				size={18}
				className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
			/>
		</form>
	</div>
);
