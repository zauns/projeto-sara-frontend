import Image from 'next/image'
import { SideBar } from '@/components/core/drawer';

export function Header(){
	return (
		<header className='sticky top-0 z-50 w-full bg-white shadow-sm'>
			<div className="flex justify-between p-4 text-black border-b items-center">
				<div className="flex items-center gap-2">
					<SideBar />
					<Image 
						src="/icons/logoSara.png"
						alt="Logo da SARA"
						width={50}
						height={50}
					/>
					<h1 className="text-2x1 font-bold">SARA</h1>
				</div>
				<div>
					<h1 className="text-2x1 font-bold">EMPREGA</h1>
				</div>
			</div>
		</header>
	)
}