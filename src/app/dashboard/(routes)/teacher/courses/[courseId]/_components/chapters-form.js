"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import {Chapter, Course} from "@prisma/client"
import { ChaptersList } from "./chapters-list";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({
  initialData,
  courseId,
}) => {
  const [isCreating, setIsCreating]= useState(false)
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating=()=> setIsCreating((current)=> !current)
  const router=useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues:{
      title: "",
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
        await axios.post(`/api/courses/${courseId}/chapters`, values);
        toast.success("chapter created ");
        toggleCreating();
        router.refresh();
    } catch (error) {
        toast.error("something went wrong")
    }
  };
  const onReorder = async(updateData)=>{try {
    setIsUpdating(true)

    await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
      list: updateData
    })

  } catch (error) {
    toast.error("something went wrong")
    router.refresh()
  }finally{
    setIsUpdating(false)
  }
}
const onEdit=(id)=>{
  router.push(`/dashboard/teacher/courses/${courseId}/chapters/${id}`)
}
  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button 
          variant="ghost"
          onClick={toggleCreating}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      
      {isCreating &&(
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
                <FormField
                control={form.control}
                name="title"
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <Input
                            disabled={isSubmitting}
                            placeholder="e.g. 'aIntroduction to the course'"
                            {...field}/>
                        </FormControl>
                    </FormItem>
                )}/>
                
                    <Button
                    disabled={!isValid || isSubmitting}
                    type="submit">
                        Create
                    </Button>
                
            </form>
        </Form>
      )}
      {!isCreating &&(
        <div className={cn(
          "text-sm mt-2",
          !initialData.chapters.length && "text-slate-500 italic"
        )}>
          {!initialData.chapters.length && "No chapters"}
          <ChaptersList
          onEdit={onEdit}
          onReorder={onReorder}
          items={initialData.chapters || {}}
          />
          </div>
      )}
      {
        !isCreating && (
          <p className="text-xs text-muted-foreground mt-4">
            Drag and Drop to reorder the chapters
          </p>
        )
      }
    </div>
  );
};
