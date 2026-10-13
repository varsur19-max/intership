<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        abort_if(Auth::check(), 409, 'Դու արդեն մուտք ես գործել։');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'username' => [
                'required',
                'string',
                'alpha_dash:ascii',
                'min:3',
                'max:50',
                'unique:users,username',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'password' => [
                'bail',
                'required',
                'string',
                'min:8',
                'max:72',
                'confirmed',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (config('hashing.driver') === 'bcrypt' && strlen($value) > 72) {
                        $fail('Գաղտնաբառը չի կարող գերազանցել 72 բայթը։');
                    }
                },
            ],
        ], [
            'name.required' => 'Գրիր անունդ։',
            'username.required' => 'Գրիր օգտանունը։',
            'username.alpha_dash' => 'Օգտանունը կարող է պարունակել լատինատառեր, թվեր, - և _։',
            'username.min' => 'Օգտանունը պետք է ունենա առնվազն 3 նիշ։',
            'username.unique' => 'Այս օգտանունն արդեն զբաղված է։',
            'email.required' => 'Գրիր էլեկտրոնային հասցեն։',
            'email.email' => 'Գրիր ճիշտ էլեկտրոնային հասցե։',
            'email.unique' => 'Այս էլեկտրոնային հասցեն արդեն գրանցված է։',
            'password.required' => 'Գրիր գաղտնաբառը։',
            'password.min' => 'Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ։',
            'password.confirmed' => 'Գաղտնաբառերը չեն համընկնում։',
        ]);

        $user = User::create($data);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Գրանցումը հաջողվեց։',
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        abort_if(Auth::check(), 409, 'Դու արդեն մուտք ես գործել։');

        $credentials = $request->validate([
            'username' => ['required', 'string', 'max:50'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'username' => 'Օգտանունը կամ գաղտնաբառը սխալ է։',
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Մուտքը հաջողվեց։',
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Դու դուրս եկար հաշվից։',
        ]);
    }

    public function current(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => $user
                ? $user->only(['id', 'name', 'username', 'role'])
                : null,
        ])->header('Cache-Control', 'no-store');
    }
}
