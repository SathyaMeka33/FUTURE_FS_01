from django import forms

from .models import ContactMessage


class ContactMessageForm(forms.ModelForm):
    name = forms.CharField(
        max_length=120,
        min_length=2,
        strip=True,
        widget=forms.TextInput(
            attrs={
                "placeholder": "Your name",
                "required": "required",
                "maxlength": "120",
            }
        ),
    )
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                "placeholder": "you@example.com",
                "required": "required",
            }
        )
    )
    message = forms.CharField(
        min_length=5,
        strip=True,
        widget=forms.Textarea(
            attrs={
                "placeholder": "Tell me about your project",
                "required": "required",
                "rows": "6",
            }
        ),
    )

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "message"]

    def clean_name(self):
        name = (self.cleaned_data.get("name") or "").strip()
        if not name:
            raise forms.ValidationError("Name is required.")
        return name

    def clean_message(self):
        message = (self.cleaned_data.get("message") or "").strip()
        if not message:
            raise forms.ValidationError("Message is required.")
        return message
