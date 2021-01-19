# Tokens for testing teacher / student
Teacher: http://localhost:8080/?token=eyJhbGciOiJIUzI1NiJ9.eyJ0ZWFjaGVyIjp0cnVlLCJtYXRlcmlhbHMiOlt7Im5hbWUiOiJNYXRlcmlhbCAxIiwidXJsIjoiL2g1cC9wbGF5LzVlY2Y0ZTRiNjExZTE4Mzk4ZjczODBlZiJ9XSwicm9vbUlkIjoicm9vbTAxIn0.QicJnme4iNNXSKkXyOW4rGMOkKrSwVITXLYLevXjEYg

Student: http://localhost:8080/?token=eyJhbGciOiJIUzI1NiJ9.eyJ0ZWFjaGVyIjpmYWxzZSwibWF0ZXJpYWxzIjpbeyJuYW1lIjoiTWF0ZXJpYWwgMSIsInVybCI6Ii9oNXAvcGxheS81ZWNmNGU0YjYxMWUxODM5OGY3MzgwZWYifV0sInJvb21JZCI6InJvb20wMSJ9.3_LBVx8poa0yQd6Jgy8w2bMDywLl0NDAH98pdmpX17E

# Dev
If you have trouble building this project due to issues cloning `kidsloop-canvas` then you can try adjusting your `.gitconfig` to have the following information:
```
[url "ssh://git@bitbucket.org"]
	insteadOf = https://bitbucket.org
```
this should prevent npm from trying to use https when pulling down repos from bitbucket.  
