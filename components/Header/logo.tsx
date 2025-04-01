import Image from 'next/image';
import logo from '@/public/logo.png';

export function Logo() {
	return (
		<div className="flex items-center">
			<Image
				src={logo}
				alt="NexusHub Logo"
				width={86}
				height={13}
			/>
		</div>
	);
}
