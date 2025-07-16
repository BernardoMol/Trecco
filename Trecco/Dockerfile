FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /app

COPY ./BibliotecaSUPABASE ./BibliotecaSUPABASE
COPY ./ApiTreccoRENDER ./ApiTreccoRENDER

WORKDIR /app/ApiTreccoRENDER
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview
WORKDIR /app
COPY --from=build /app/ApiTreccoRENDER/out .

ENTRYPOINT ["dotnet", "ApiTreccoRENDER.dll"]
