<?php

namespace App\Http\Controllers;

use App\Mail\ContactMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate(
            [
                'message' => ['required', 'string', 'min:10', 'max:5000'],
            ],
            [
                'message.required' => 'Գրիր նամակը այստեղ։',
                'message.min' => 'Նամակը պետք է ունենա առնվազն 10 նիշ։',
                'message.max' => 'Նամակը չափազանց երկար է։',
            ]
        );

        Mail::send(new ContactMail($request->user(), $data['message']));

        return response()->json(
            [
                'message' => 'Նամակը ուղարկվեց։',
            ]
        );
    }
}
