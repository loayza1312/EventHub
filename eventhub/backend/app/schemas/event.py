from marshmallow import Schema, fields, validate

class EventSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=3, max=100))
    description = fields.Str(required=True)
    date = fields.DateTime(required=True)  # Formato accettato ISO: YYYY-MM-DDTHH:MM:SS
    location = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    category = fields.Str(required=True, validate=validate.OneOf(["concerti", "workshop", "presentazioni"]))
    price = fields.Float(required=True, validate=validate.Range(min=0.0))
    total_seats = fields.Int(required=True, validate=validate.Range(min=1))
    available_seats = fields.Int(dump_only=True)
    image_path = fields.Str(dump_only=True)
    organizer_id = fields.Int(dump_only=True)