import { Inter, IBM_Plex_Mono, Orbitron } from 'next/font/google';
import './globals.css';

// Initialize the fonts
const inter = Inter({ subsets: ['latin'] });
const ibmPlexMono = IBM_Plex_Mono({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-ibm-plex-mono',
});
const orbitron = Orbitron({
	subsets: ['latin'],
	variable: '--font-orbitron',
});

export const metadata = {
	title: 'Nexus - Steam Store Hub',
	description:
		'Games featured, VR, free to play - Your ultimate gaming destination ',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${inter.className} ${ibmPlexMono.variable} ${orbitron.variable}`}
		>
			<body className="min-h-screen bg-background">
				{children}
				<div id="hover-portal-container" />
			</body>
		</html>
	);
}
