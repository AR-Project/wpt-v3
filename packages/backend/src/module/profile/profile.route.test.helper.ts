import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import type { AuthUser } from "@/lib/auth";
import type { app } from "@/main";

type CreateUser = {
	email: string;
	password: string;
	name: string;
};

type HonoApp = typeof app;

type CreateChildUserRes = {
	message: string;
	user: AuthUser;
};

export async function createChildUser(
	payload: CreateUser,
	cookie: string,
	app: HonoApp,
) {
	const createUserRes = await app.request(`/api/profile/children`, {
		headers: {
			"Content-Type": "application/json",
			Cookie: cookie,
		},
		body: JSON.stringify(payload),
		method: "POST",
	});
	const json = (await createUserRes.json()) as CreateChildUserRes;

	if (!json.user) throw new Error("fail to create child user");

	return {
		user: json.user,
		cleanUser: async () => {
			await authTableHelper.clean({ userId: json.user.id });
		},
	};
}
