import {
  ContactOutcome,
  Klantcontact,
  KlantcontactDTO,
  mapDtoToModel,
  mapModelToDto,
} from "./customer-contact.model";

describe("mapModelToDto", () => {
  it("should correctly map all fields from DTO to model", () => {
    const dto: KlantcontactDTO = {
      nummer: "123",
      kanaal: "email",
      onderwerp: "Test Subject",
      inhoud: "Test content",
      indicatieContactGelukt: "true",
      taal: "en",
      vertrouwelijk: false,
      plaatsgevondenOp: "2025-12-18T15:30:00Z",
    };
    const model = mapDtoToModel(dto);

    expect(model.id).toBe("123");
    expect(model.channel).toBe("email");
    expect(model.subject).toBe("Test Subject");
    expect(model.content).toBe("Test content");
    expect(model.outcome).toBe(ContactOutcome.SUCCESS);
    expect(model.preferredLanguage).toBe("en");
    expect(model.isConfidential).toBe(false);
    expect(model.occurredAt?.toISOString()).toBe("2025-12-18T15:30:00.000Z");
  });

  it("should handle missing optional fields and unknown boolean strings", () => {
    const dto: KlantcontactDTO = {
      kanaal: "phone",
      onderwerp: "Missing fields",
      indicatieContactGelukt: null,
      taal: "nl",
      vertrouwelijk: false,
    };

    const model = mapDtoToModel(dto);

    expect(model.id).toBeUndefined();
    expect(model.channel).toBe("phone");
    expect(model.subject).toBe("Missing fields");
    expect(model.content).toBeUndefined();
    expect(model.outcome).toBe(ContactOutcome.NOT_APPLICABLE);
    expect(model.preferredLanguage).toBe("nl");
    expect(model.isConfidential).toBe(false);
    expect(model.occurredAt).toBeUndefined();
  });
});

describe("mapModelToDto", () => {
  it("should correctly map all fields from model to DTO", () => {
    const model: Klantcontact = {
      id: "456",
      channel: "chat",
      subject: "Hello",
      content: "Some content",
      outcome: ContactOutcome.FAILURE,
      preferredLanguage: "nl",
      isConfidential: true,
      occurredAt: new Date("2025-12-18T16:00:00Z"),
    };

    const dto = mapModelToDto(model);

    expect(dto.nummer).toBe("456");
    expect(dto.kanaal).toBe("chat");
    expect(dto.onderwerp).toBe("Hello");
    expect(dto.inhoud).toBe("Some content");
    expect(dto.indicatieContactGelukt).toBe("false");
    expect(dto.taal).toBe("nl");
    expect(dto.vertrouwelijk).toBe(true);
    expect(dto.plaatsgevondenOp).toBe("2025-12-18T16:00:00.000Z");
  });

  it("should handle missing optional fields", () => {
    const model: Klantcontact = {
      channel: "sms",
      subject: "Test",
      outcome: ContactOutcome.UNKNOWN,
      preferredLanguage: "en",
      isConfidential: false,
    };

    const dto = mapModelToDto(model);

    expect(dto.nummer).toBeUndefined();
    expect(dto.kanaal).toBe("sms");
    expect(dto.onderwerp).toBe("Test");
    expect(dto.inhoud).toBeUndefined();
    expect(dto.indicatieContactGelukt).toBe(undefined); // because model.outcome is ContactOutcome.UNKNOWN
    expect(dto.taal).toBe("en");
    expect(dto.vertrouwelijk).toBe(false);
    expect(dto.plaatsgevondenOp).toBeUndefined();
  });
});
