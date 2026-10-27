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
                'message.min' => 'նամակը պետք է ունենա առնվազն 10 նիշ։',
                'message.max' => 'նամակը չափազանց երկար է։',
            ]
        );

        Mail::send(new ContactMail($request->user(), $data['message']));

        return response()->json(
            [
                'message' => 'նամակը ուղարկվեց։',
            ]
        );
    }
}
