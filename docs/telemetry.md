# Telemetrie

**Da CaBr<sub>2</sub> sich noch in der Entwicklungsphase befindet, kann es noch zu unvollständigen oder fehlerhaften Suchergebnissen kommen!**

Um die Suche verlässlicher und genauer gestalten zu können, müssen die Stoffe analysiert werden, bei denen Probleme bei der Suche aufgetreten sind.

Um dies machbar zu machen, würden wir gerne im Hintergrund diese Stoffe zu uns senden, damit das Programm so gut wie möglich verbessert und für euch möglichst viel automatisiert werden kann.

Die Daten, die wir bekommen, werden in diesem Format gesendet:

```js
{
    "gestisId": "000815",  // ID des Stoffes in der Gestis Datenbank
    "parts": [
        "lethalDose",
        "hPhrases"
    ]
}
```

> Disclaimer: Es wird bei der Übermittlung auch die eigene IP-Adresse übermittelt, aber diese wird nicht gespeichert.
> Ohne die IP-Adresse ist eine Übermittlung über das Internt nicht möglich.
>
> Der Quellcode des Servers ist hier zu finden: <https://github.com/Calciumdibromid/telefon>.

<br>

Wenn du bei der Weiterentwicklung des Projekts mithelfen möchtest, kannst du im Folgenden zustimmen.

Deine Entscheidung kann in den Einstellungen geändert werden.
