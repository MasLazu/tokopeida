import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { FiMinus, FiPlus } from "react-icons/fi"
import { FaTrashAlt } from "react-icons/fa"
import Image from "next/image"

export default function ProductItem() {
  return (
    <div className="row md:grid md:grid-cols-7 gap-5 w-full">
      <div className="col-span-2 md:flex items-center md:gap-5 gap-3 hidden">
        <Checkbox id="select-all" />
        <div className="flex-grow">
          <AspectRatio ratio={16 / 13}>
            <Image
              className="rounded-md object-cover"
              src="https://images.tokopedia.net/img/cache/100-square/VqbcmM/2023/8/4/b6136181-3a9e-47d0-9bd5-cfd2abcf4b19.jpg.webp?ect=4g"
              alt="produc photo"
              fill
            />
          </AspectRatio>
        </div>
      </div>
      <div className="col-span-5 flex gap-5 lg:gap-0 items-center">
        <Checkbox className="md:hidden" />
        <div className="overflow-hidden lg:text-lg lg:h-full lg:flex lg:flex-col lg:justify-around">
          <div>
            <h4 className="font-semibold truncate lg:text-xl">
              SSD M2 NVME / M.2 NVME/ M2NVME 512GB KAIZEN RESMI
            </h4>
            Rp. 1.000.000
          </div>
          <div className="flex gap-5 items-center mt-2">
            <div className="flex gap-2 items-center">
              <Button size="icon" className="lg:h-9 lg:w-6 h-7 w-4">
                <FiMinus className="w-3 h-3 text-background" />
              </Button>
              <Input type="number" className="lg:h-9 h-7 w-12 text-center" />
              <Button size="icon" className="lg:h-9 lg:w-6 h-7 w-4">
                <FiPlus className="w-3 h-3 text-background" />
              </Button>
            </div>
            <Button size="icon" className="lg:h-9 h-7 " variant="destructive">
              <FaTrashAlt className="w-[0.8rem] h-[0.8rem] text-background" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
