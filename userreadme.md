# Instalacja bota:

* Zainstaluj node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/) podczas instalacji zaakceptuj wszystko.
* Wypakuj plik `bot.zip`. Po wypakowaniu w wybranym miejscu pojawi się folder o nazwie `linkedin-bot`. Wejdź do niego i wykonaj ponizsze kroki.
* Zainstaluj paczki niezbędne do uruchomienia bota, w tym celu kliknij 2 razy na plik `install` w folderze `linkedin-bot`
* Jeśli otworzy Ci się okno z notatnikiem potwierdz utworzenie nowego pliku (jeśli tego nie zrobisz bot nie będzie działał) - po kliknięciu `tak`, mozesz zamknąć plik.
* Jeśli nie posiadasz przeglądatki chrome zainstaluj ją.
* uruchom bota klikając 2 razy na plik `bot` bot powinien otworzyć przeglądrkę z interfejsem.
* wprowadz kod autoryzacyjny. Znajduje się on w pliku `auth-key.txt`.
# Opis działania:

Bot autmatycznie przechodzi do listy kontaktów i na podstawie przekazanych mu danych wysyła wiadomości.
Po kadej akcji na linkedin bot wstrzymuje działanie na określony czas. Od 5 sekund do kilku minut - zmniejsza to ryzyko zablokowania konta z powodu zbyt duzej ilości podejmowanych dzialan na stronie.

email, numer telefonu, oraz hasło są zapisywane w pamięci przeglądarki (nie są nigdzie wysyłane), bot korzysta z tych danych podczas logowania do portalu. Dzieje się tak poniewaz silnik za kazdym razem uruchamia przegladarkę w trybie "incognito"

### Opis kryteriów:
- wysyłaj do: jeśli nie wybierzesz nic wiadomości będą wysyłąne do wszystkich, tak samo jakbyś wybrał "kazdego"
- wybierz region: mozesz zanzaczyc kilka wojewodźtw. Wybrane wojewódźtwa będą podświetlone na niebiesko oraz pokaze sie lista pod spodem
- wiadomość: Treść wysyłanej wiadomości
- wiadomość follow up: wiadomość która będzie wysłana po 7dniach od ostatniego kontaktu
> Do poprawnego wysłania wiadomości follow up musisz wpisać zarówno standardowa wiadomość jak i wiadomość follow up. Bot na tej podstawie wie jaką wiadomość ma wysłać po 7dniach
- ile wiadomości wysłć: Domyślnie `0` oznacza, ze będzie wysyłał do wyczerpania kontaktów pasujących do podanych kryterów.


### Dodatkowe informacje:
W prawym górym logu znajduje się "dioda" oznaczająca status pracy bota.
Pod przyciskiem `start` jest lista logów aktualizująca się raz na 15 sekund (to samo w przypadku statusu)
> Jeśli wiadomość jest krótsza niz 3 znaki nie zostanie ona wysłana, a bot po prostu "przeleci" przez profile pasujące do kryteriów. Mona z tego korzystać po to aby pokazać komuś, ze odwiedziłeś jego profil i zwiększyć szanse na wizyte na Twoim profilu