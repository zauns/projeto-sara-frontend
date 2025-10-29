import Image from 'next/image'

export function Header(){
	return (
		<header className="flex justify-between p-4 bg-white text-black border-b items-center">
			<div className="flex items-center gap-2">
				<Image 
					src="/icons/4040_placeholder.png"
					alt="Logo da SARA"
					width={40}
					height={40}
				/>
				<h1 className="text-2x1 font-bold">SARA</h1>
			</div>
			<div>
				<h1 className="text-2x1 font-bold">EMPREGA</h1>
			</div>
		</header>
	)
}