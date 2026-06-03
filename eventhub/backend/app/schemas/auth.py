from marshmallow import Schema, fields, validate

class RegisterSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=64))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    role = fields.Str(dump_default="user", validate=validate.OneOf(["user", "organizer", "admin"]))

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)