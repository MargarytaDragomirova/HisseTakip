"use client";

import {
    Command,
    CommandDialog,
} from "@/components/ui/command";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, PersonIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/actions/actions";

const initialState : AuthState = {
    message: '',
}

export default function AuthDialog() {
    const [state, formAction] = useActionState(loginAction, initialState)

    return (
        <Command>
            <CommandDialog open={true}>
                <Card>
                    <CardHeader>
                        <p>Login or Register</p>
                    </CardHeader>

                    <CardContent>
                        <form action={formAction}>
                            <Input
                                className="my-5 p-2"
                                placeholder="Enter your mail"
                                type="email"
                                name="email"
                                required
                            />

                            <Input
                                className="my-5 p-2"
                                placeholder="Enter your password"
                                type="password"
                                name="password"
                                required
                            />

                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="submit"
                                    name="mode"
                                    value="login"
                                    size="sm"
                                >
                                    <CheckIcon className="mr-2 h-4 w-4" />
                                    Login
                                </Button>

                                <Button
                                    type="submit"
                                    name="mode"
                                    value="register"
                                    variant="outline"
                                    size="sm"
                                >
                                    <PersonIcon className="mr-2 h-4 w-4" />
                                    Register
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        {state?.message && (
                            <p
                                aria-live="polite"
                                className="text-sm text-red-500"
                            >
                                {state.message}
                            </p>
                        )}
                    </CardFooter>
                </Card>
            </CommandDialog>
        </Command>
    );
}
