import { z } from "zod";

const abSchema = z.object({
  name: z
    .string({ message: "姓名欄為必填" })
    .min(3, { message: "請填寫正確的姓名" }),
  email: z
    .string({ message: "電子郵箱欄為必填" })
    .email({ message: "請填寫正確的電子郵箱" }),
});

export default abSchema;
