"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export const ChapterActions=(
    {
        disabled,
        courseId,
        chapterId,
        isPublished
    }

)=>{
    const router= useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const onClick = async()=>{
        try {
           setIsLoading(true);
           if(isPublished){
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
            toast.success("chapter unpublished");
            
           } else{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
            toast.success("chapter published");
           }
           router.refresh()
        } catch (error) {
            toast.error("something went wrong")
        } finally{
            setIsLoading(false)
        }
    }

    const onDelete=async ()=>{
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("chapter deleted");
            
            router.refresh();
            router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
            toast.error("something went wrong")
        } finally{
            setIsLoading(false)
        }
    }
    return(
        <div className="flex items-center gap-x-2">
            <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant="outline"
            size="sm">
                {isPublished ? "Unpublish": "Publish"}
                
            </Button>
            <ConfirmModal onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading}>
                <Trash className="h-4 w-4"/>
            </Button>
            </ConfirmModal>

            

        </div>
    )
}