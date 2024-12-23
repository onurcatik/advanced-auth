// "use server";
// import * as z from "zod"


// import { LoginSchema } from "@/schemas";

// import { AuthError} from "next-auth";

// import { redirect } from "next/dist/server/api-utils";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
// import { signIn } from "@/auth";

// export const login = async (
//     values: z.infer<typeof LoginSchema>
//   ) => {
//     const validatedFields = LoginSchema.safeParse(values);
  
//     if (!validatedFields.success) {
//       return { error: "Invalid fields!" };
//     }
//     return { success : "Email sent!"}
// }

// const { email , password} = validatedFields.data;

// try {
//   await signIn("credentials", {
//     email,
//     password,
//     redirectTo: DEFAULT_LOGIN_REDIRECT,
//   })
// } catch (error) {
//   if (error instanceof AuthError) {
//     switch(error.type) {
//       case "CredentialsSignin" :
//       return { error: "Invalid credentials!"}
//       default : 
//       return { error: "An error occured!"}
//     }
//   }
//   throw error;
// }
// }


"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Girdi doğrulaması
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    // Oturum açma işlemi
    await signIn("credentials", {
      email,
      password,
      callbackUrl: DEFAULT_LOGIN_REDIRECT, // redirect yerine callbackUrl kullanıldı
    });

    return { success: "Email sent!" };
  } catch (error) {
    // Hata yönetimi
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "An error occurred!" };
      }
    }
    throw error; // Bilinmeyen hata yeniden fırlatılıyor
  }
};
