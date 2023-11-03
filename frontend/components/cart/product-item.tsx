import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"

export default function ProductItem() {
  return (
    <div className="row flex items-center gap-5 w-full">
      <Checkbox id="select-all" />
      <div className="w-24">
        <AspectRatio ratio={16 / 13}>
          <Image
            className="rounded-md object-cover"
            src="https://images.tokopedia.net/img/cache/100-square/VqbcmM/2023/8/4/b6136181-3a9e-47d0-9bd5-cfd2abcf4b19.jpg.webp?ect=4g"
            alt="produc photo"
            fill
          />
        </AspectRatio>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex-grow">
          <h4 className="font-semibold truncate">
            SSD M2 NVME / M.2 NVME/ M2NVME 512GB KAIZEN RESMI
          </h4>
          Rp. 1.000.000
        </div>
        <div className="flex gap-5 items-center">
          <div className="flex gap-2 items-center">
            <Button size="icon" className="h-9 w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-dash"
                viewBox="0 0 16 16"
              >
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
              </svg>
            </Button>
            <Input type="number" className="w-9 h-9" value={5}></Input>
            <Button size="icon" className="h-9 w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </Button>
          </div>
          <Button size="icon" className="h-9" variant="destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-trash-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
